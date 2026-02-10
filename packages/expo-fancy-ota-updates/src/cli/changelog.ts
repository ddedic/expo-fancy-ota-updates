import { execa } from 'execa';
import fs from 'fs/promises';
import path from 'path';
import prompts from 'prompts';
import type { OTAConfig, OTAHooks, OTAVersionData } from './schema';

/**
 * Generate changelog from git commits
 */
export async function getGitChangelog(config: OTAConfig): Promise<string[]> {
  try {
    const { commitCount, format, includeAuthor } = config.changelog;

    let formatStr = '%s'; // subject only
    if (format === 'detailed') {
      formatStr = includeAuthor ? '%s (%an)' : '%s%n%b'; // subject + body or author
    } else if (includeAuthor) {
      formatStr = '%s (%an)';
    }

    const { stdout } = await execa('git', [
      'log',
      `-${commitCount}`,
      `--pretty=format:${formatStr}`,
    ]);

    return stdout
      .split('\n')
      .filter((line) => line.trim() !== '')
      .slice(0, commitCount);
  } catch {
    console.warn('Failed to get git changelog, using fallback');
    return ['Minor fixes and improvements'];
  }
}

/**
 * Get changelog from file
 */
export async function getFileChangelog(filePath: string): Promise<string[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');

    // Try to parse as JSON array
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => typeof item === 'string');
      }
    } catch {
      // Not JSON, treat as text file
    }

    // Parse as markdown or plain text (one item per line starting with - or *)
    return content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('-') || line.startsWith('*'))
      .map((line) => line.replace(/^[-*]\s*/, ''))
      .filter((line) => line.length > 0);
  } catch (error: any) {
    throw new Error(`Failed to read changelog file: ${error.message}`);
  }
}

/**
 * Get changelog via manual input
 */
export async function getManualChangelog(): Promise<string[]> {
  const changelog: string[] = [];

  console.log('\nEnter changelog items (press Enter with empty line to finish):');

  while (true) {
    const response = await prompts({
      type: 'text',
      name: 'item',
      message: changelog.length === 0 ? 'First item:' : 'Next item (or press Enter to finish):',
    });

    if (!response.item || response.item.trim() === '') {
      break;
    }

    changelog.push(response.item.trim());
  }

  if (changelog.length === 0) {
    changelog.push('Update');
  }

  return changelog;
}

/**
 * Generate changelog based on config
 */
export async function generateChangelog(
  config: OTAConfig,
  cwd: string,
  currentVersion: OTAVersionData | null,
  channel: string
): Promise<string[]> {
  const hooks = config.hooks as OTAHooks | undefined;

  switch (config.changelog.source) {
    case 'git':
      return getGitChangelog(config);

    case 'file': {
      if (!config.changelog.filePath) {
        throw new Error('changelog.filePath is required when source is "file"');
      }
      const resolvedPath = path.isAbsolute(config.changelog.filePath)
        ? config.changelog.filePath
        : path.resolve(cwd, config.changelog.filePath);
      return getFileChangelog(resolvedPath);
    }

    case 'manual':
      return getManualChangelog();

    case 'custom': {
      if (!hooks?.generateChangelog) {
        throw new Error('changelog.source "custom" requires hooks.generateChangelog');
      }
      const customChangelog = await hooks.generateChangelog({
        currentVersion,
        channel,
        cwd,
      });
      if (!Array.isArray(customChangelog) || !customChangelog.every((item) => typeof item === 'string')) {
        throw new Error('hooks.generateChangelog must return string[]');
      }
      return customChangelog;
    }

    default:
      return getGitChangelog(config);
  }
}
