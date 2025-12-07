import { z } from 'zod';

// ============================================================================
// Config Schema
// ============================================================================

export const OTAConfigSchema = z.object({
  // Version file location
  versionFile: z.string().default('./ota-version.json'),
  
  // Base version (or 'package.json' to read from package.json)
  baseVersion: z.union([z.string(), z.literal('package.json')]).default('1.0.0'),
  
  // Version format template
  versionFormat: z.string().default('{major}.{minor}.{patch}-{channel}.{build}'),
  
  // Version strategy
  versionStrategy: z.enum(['semver', 'build', 'date', 'custom']).default('build'),
  
  // Changelog configuration
  changelog: z.object({
    source: z.enum(['git', 'manual', 'file', 'custom']).default('git'),
    commitCount: z.number().default(10),
    format: z.enum(['short', 'detailed']).default('short'),
    includeAuthor: z.boolean().default(false),
    filePath: z.string().optional(),
  }),
  
  // EAS configuration
  eas: z.object({
    autoPublish: z.boolean().default(true),
    messageFormat: z.string().default('v{version}: {firstChange}'),
  }),
  
  // Channels
  channels: z.array(z.string()).default(['development', 'preview', 'production']),
  defaultChannel: z.string().default('development'),
  
  // Hooks (optional functions - validated at runtime, not in schema)
  hooks: z.any().optional(),
}).passthrough(); // Allow additional properties

export type OTAConfig = z.infer<typeof OTAConfigSchema>;

// ============================================================================
// Version Data Schema
// ============================================================================

export const OTAVersionDataSchema = z.object({
  version: z.string(),
  buildNumber: z.number(),
  releaseDate: z.string(),
  channel: z.string(),
  changelog: z.array(z.string()),
});

export type OTAVersionData = z.infer<typeof OTAVersionDataSchema>;

// ============================================================================
// Default Config
// ============================================================================

export const defaultConfig: OTAConfig = {
  versionFile: './ota-version.json',
  baseVersion: '1.0.0',
  versionFormat: '{major}.{minor}.{patch}-{channel}.{build}',
  versionStrategy: 'build',
  changelog: {
    source: 'git',
    commitCount: 10,
    format: 'short',
    includeAuthor: false,
  },
  eas: {
    autoPublish: true,
    messageFormat: 'v{version}: {firstChange}',
  },
  channels: ['development', 'preview', 'production'],
  defaultChannel: 'development',
};
