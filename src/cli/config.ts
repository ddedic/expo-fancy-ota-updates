import { cosmiconfig } from 'cosmiconfig';
import path from 'path';
import fs from 'fs/promises';
import { OTAConfigSchema, defaultConfig, type OTAConfig } from './schema';

const explorer = cosmiconfig('ota-updates', {
  searchPlaces: [
    'ota-updates.config.js',
    'ota-updates.config.mjs',
    'ota-updates.config.cjs',
    'ota-updates.config.json',
    '.ota-updatesrc',
    '.ota-updatesrc.json',
    '.ota-updatesrc.js',
  ],
});

/**
 * Load and validate OTA configuration
 */
export async function loadConfig(cwd: string = process.cwd()): Promise<OTAConfig> {
  try {
    const result = await explorer.search(cwd);
    
    if (!result || !result.config) {
      // No config found, use defaults
      return defaultConfig;
    }
    
    // Deep merge with defaults to ensure all fields exist
    const merged = {
      ...defaultConfig,
      ...result.config,
      changelog: {
        ...defaultConfig.changelog,
        ...(result.config.changelog || {}),
      },
      eas: {
        ...defaultConfig.eas,
        ...(result.config.eas || {}),
      },
    };
    
    // Validate merged config
    const config = OTAConfigSchema.parse(merged);
    
    return config;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load config: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Initialize a new config file
 */
export async function initConfig(cwd: string = process.cwd()): Promise<void> {
  const configPath = path.join(cwd, 'ota-updates.config.js');
  
  // Check if config already exists
  try {
    await fs.access(configPath);
    throw new Error('Config file already exists at ota-updates.config.js');
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
  
  // Create config file
  const configContent = `/**
 * OTA Updates Configuration
 * @type {import('@ddedic/expo-fancy-ota-updates').OTAConfig}
 */
export default {
  // Version file location
  versionFile: './ota-version.json',
  
  // Base version (or 'package.json' to read from package.json)
  baseVersion: '1.0.0',
  
  // Version format template
  versionFormat: '{major}.{minor}.{patch}-{channel}.{build}',
  
  // Version strategy: 'semver' | 'build' | 'date' | 'custom'
  versionStrategy: 'build',
  
  // Changelog configuration
  changelog: {
    source: 'git', // 'git' | 'manual' | 'file' | 'custom'
    commitCount: 10,
    format: 'short', // 'short' | 'detailed'
    includeAuthor: false,
  },
  
  // EAS configuration
  eas: {
    autoPublish: true,
    messageFormat: 'v{version}: {firstChange}',
  },
  
  // Available channels
  channels: ['development', 'preview', 'production'],
  defaultChannel: 'development',
  
  // Hooks (optional)
  // hooks: {
  //   beforePublish: async (version) => {
  //     console.log(\`Publishing \${version.version}...\`);
  //   },
  //   afterPublish: async (version) => {
  //     console.log(\`Published \${version.version}\`);
  //   },
  //   onError: async (error) => {
  //     console.error('Publish failed:', error);
  //   },
  // },
};
`;
  
  await fs.writeFile(configPath, configContent, 'utf-8');
}
