import fs from 'fs/promises';
import path from 'path';
import { OTAVersionDataSchema, type OTAVersionData, type OTAConfig } from './schema';

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
    } catch (error) {
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

/**
 * Format version string
 */
function formatVersion(
  template: string,
  vars: {
    major: number;
    minor: number;
    patch: number;
    channel: string;
    build: number;
    timestamp?: string;
  }
): string {
  return template
    .replace('{major}', vars.major.toString())
    .replace('{minor}', vars.minor.toString())
    .replace('{patch}', vars.patch.toString())
    .replace('{channel}', vars.channel)
    .replace('{build}', vars.build.toString())
    .replace('{timestamp}', vars.timestamp || '');
}

/**
 * Increment version based on strategy
 */
export async function incrementVersion(
  current: OTAVersionData | null,
  channel: string,
  changelog: string[],
  config: OTAConfig,
  cwd: string
): Promise<OTAVersionData> {
  const baseVersion = await getBaseVersion(config, cwd);
  const { major, minor, patch } = parseSemver(baseVersion);
  const buildNumber = (current?.buildNumber || 0) + 1;
  const now = new Date();
  
  let version: string;
  
  switch (config.versionStrategy) {
    case 'semver': {
      // Auto-increment patch version
      const newPatch = current ? parseSemver(current.version).patch + 1 : patch;
      version = formatVersion(config.versionFormat, {
        major,
        minor,
        patch: newPatch,
        channel,
        build: buildNumber,
      });
      break;
    }
    
    case 'date': {
      // Use date as part of version
      const timestamp = now.toISOString().split('T')[0].replace(/-/g, '');
      version = formatVersion(config.versionFormat, {
        major,
        minor,
        patch,
        channel,
        build: buildNumber,
        timestamp,
      });
      break;
    }
    
    case 'build':
    default: {
      // Just increment build number
      version = formatVersion(config.versionFormat, {
        major,
        minor,
        patch,
        channel,
        build: buildNumber,
      });
      break;
    }
  }
  
  return {
    version,
    buildNumber,
    releaseDate: now.toISOString(),
    channel,
    changelog,
  };
}
