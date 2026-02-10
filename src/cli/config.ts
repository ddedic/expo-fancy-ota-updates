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

  // Optional per-channel version templates
  // versionFormatByChannel: {
  //   production: '{major}.{minor}.{patch}-p{build}',
  // },
  
  // Version strategy: 'semver' | 'build' | 'date' | 'custom'
  versionStrategy: 'build',

  // Optional aliases used by {channelAlias}
  // channelAliases: {
  //   development: 'd',
  //   preview: 'pr',
  //   production: 'p',
  // },
  
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
    // Optional per-channel message templates
    // messageFormatByChannel: {
    //   production: 'release {version} ({channelAlias})',
    // },
  },
  
  // Available channels
  channels: ['development', 'preview', 'production'],
  defaultChannel: 'development',
  
  // Hooks (optional)
  // hooks: {
  //   beforePublish: async ({ changelog }) => {
  //     // Can return changelog/message/version overrides
  //     return {
  //       changelog,
  //       message: \`Deploying with \${changelog.length} changes\`,
  //     };
  //   },
  //   generateVersion: async ({ defaultVersion, templateVars }) => {
  //     // Used when versionStrategy: 'custom'
  //     return \`\${defaultVersion}-sha.\${templateVars.build}\`;
  //   },
  //   generateChangelog: async () => {
  //     // Used when changelog.source: 'custom'
  //     return ['Custom release note'];
  //   },
  //   afterPublish: async (version, context) => {
  //     console.log(\`Published \${version.version} to \${context.channel}\`);
  //   },
  //   onError: async (error, context) => {
  //     console.error(\`Publish failed in \${context.cwd}:\`, error);
  //   },
  // },
};
`;
  
  await fs.writeFile(configPath, configContent, 'utf-8');
}
