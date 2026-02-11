import fs from 'fs/promises';
import path from 'path';
import {
  OTAVersionDataSchema,
  type OTAVersionData,
  type OTAConfig,
  type OTAHooks,
  type VersionStrategy,
  type VersionTemplateVariables,
} from './schema';
import { getChannelTemplate, renderTemplate } from './template';

export interface VersionOverrides {
  strategy?: VersionStrategy;
  versionFormat?: string;
}

/**
 * Read version data from file
 */
export async function readVersionData(filePath: string): Promise<OTAVersionData | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    return OTAVersionDataSchema.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw new Error(`Failed to read version file: ${error.message}`);
  }
}

/**
 * Write version data to file
 */
export async function writeVersionData(filePath: string, data: OTAVersionData): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Get base version from package.json or config
 */
export async function getBaseVersion(config: OTAConfig, cwd: string): Promise<string> {
  if (config.baseVersion === 'package.json') {
    try {
      const pkgPath = path.join(cwd, 'package.json');
      const pkgContent = await fs.readFile(pkgPath, 'utf-8');
      const pkg = JSON.parse(pkgContent);
      return pkg.version || '1.0.0';
    } catch {
      console.warn('Failed to read version from package.json, using 1.0.0');
      return '1.0.0';
    }
  }
  return config.baseVersion;
}

/**
 * Parse semantic version
 */
function parseSemver(version: string): { major: number; minor: number; patch: number } {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) {
    return { major: 1, minor: 0, patch: 0 };
  }
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
}

function getChannelAlias(config: OTAConfig, channel: string): string {
  return config.channelAliases[channel] ?? channel;
}

function getVersionTemplate(
  config: OTAConfig,
  channel: string,
  overrides?: VersionOverrides
): string {
  if (overrides?.versionFormat) {
    return overrides.versionFormat;
  }
  return getChannelTemplate(channel, config.versionFormat, config.versionFormatByChannel);
}

/**
 * Format version string
 */
function formatVersion(template: string, vars: VersionTemplateVariables): string {
  return renderTemplate(template, vars);
}

/**
 * Increment version based on strategy
 */
export async function incrementVersion(
  current: OTAVersionData | null,
  channel: string,
  changelog: string[],
  config: OTAConfig,
  cwd: string,
  overrides?: VersionOverrides
): Promise<OTAVersionData> {
  const baseVersion = await getBaseVersion(config, cwd);
  const parsedBaseVersion = parseSemver(baseVersion);
  const buildNumber = (current?.buildNumber || 0) + 1;
  const now = new Date();
  const strategy = overrides?.strategy ?? config.versionStrategy;
  const channelAlias = getChannelAlias(config, channel);

  const templateVars: VersionTemplateVariables = {
    ...parsedBaseVersion,
    channel,
    channelAlias,
    build: buildNumber,
    timestamp: now.toISOString().split('T')[0].replace(/-/g, ''),
  };

  const selectedTemplate = getVersionTemplate(config, channel, overrides);
  const hooks = config.hooks as OTAHooks | undefined;
  const defaultVersion = formatVersion(selectedTemplate, templateVars);

  let version = defaultVersion;
  let override: Partial<OTAVersionData> = {};

  switch (strategy) {
    case 'semver': {
      const newPatch = current ? parseSemver(current.version).patch + 1 : parsedBaseVersion.patch;
      version = formatVersion(selectedTemplate, {
        ...templateVars,
        patch: newPatch,
      });
      break;
    }

    case 'date': {
      version = formatVersion(selectedTemplate, templateVars);
      break;
    }

    case 'custom': {
      if (!hooks?.generateVersion) {
        throw new Error('versionStrategy "custom" requires hooks.generateVersion');
      }
      const customResult = await hooks.generateVersion({
        currentVersion: current,
        channel,
        changelog,
        cwd,
        buildNumber,
        baseVersion,
        parsedBaseVersion,
        templateVars,
        defaultVersion,
      });

      if (typeof customResult === 'string') {
        version = customResult;
      } else if (customResult && typeof customResult === 'object') {
        override = customResult;
        if (customResult.version) {
          version = customResult.version;
        }
      }
      break;
    }

    case 'build':
    default: {
      version = formatVersion(selectedTemplate, templateVars);
      break;
    }
  }

  const baseVersionData: OTAVersionData = {
    version,
    buildNumber,
    releaseDate: now.toISOString(),
    channel,
    changelog,
  };

  return OTAVersionDataSchema.parse({
    ...baseVersionData,
    ...override,
    version: override.version ?? baseVersionData.version,
    buildNumber: override.buildNumber ?? baseVersionData.buildNumber,
    releaseDate: override.releaseDate ?? baseVersionData.releaseDate,
    channel: override.channel ?? baseVersionData.channel,
    changelog: override.changelog ?? baseVersionData.changelog,
  });
}
