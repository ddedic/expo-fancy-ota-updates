import { z } from 'zod';

// ============================================================================
// Primitive Types
// ============================================================================

export const VersionStrategySchema = z.enum(['semver', 'build', 'date', 'custom']);
export type VersionStrategy = z.infer<typeof VersionStrategySchema>;

export const ChangelogSourceSchema = z.enum(['git', 'manual', 'file', 'custom']);
export type ChangelogSource = z.infer<typeof ChangelogSourceSchema>;

export interface VersionTemplateVariables {
  major: number;
  minor: number;
  patch: number;
  channel: string;
  channelAlias: string;
  build: number;
  timestamp: string;
}

// ============================================================================
// Config Schema
// ============================================================================

const OTAConfigBaseSchema = z.object({
  // Version file location
  versionFile: z.string().default('./ota-version.json'),

  // Base version (or 'package.json' to read from package.json)
  baseVersion: z.union([z.string(), z.literal('package.json')]).default('1.0.0'),

  // Default version format template
  versionFormat: z.string().default('{major}.{minor}.{patch}-{channel}.{build}'),

  // Per-channel version format template overrides
  versionFormatByChannel: z.record(z.string(), z.string()).default({}),

  // Version strategy
  versionStrategy: VersionStrategySchema.default('build'),

  // Short aliases for channel labels in templates (e.g. production -> p)
  channelAliases: z.record(z.string(), z.string()).default({}),

  // Changelog configuration
  changelog: z.object({
    source: ChangelogSourceSchema.default('git'),
    commitCount: z.number().int().positive().default(10),
    format: z.enum(['short', 'detailed']).default('short'),
    includeAuthor: z.boolean().default(false),
    filePath: z.string().optional(),
  }),

  // EAS configuration
  eas: z.object({
    autoPublish: z.boolean().default(true),
    messageFormat: z.string().default('v{version}: {firstChange}'),
    // Per-channel message format template overrides
    messageFormatByChannel: z.record(z.string(), z.string()).default({}),
    platforms: z.array(z.enum(['ios', 'android'])).optional(), // If not set, EAS will build for all configured platforms
  }),

  // Channels
  channels: z.array(z.string()).min(1).default(['development', 'preview', 'production']),
  defaultChannel: z.string().default('development'),

  // Hooks (validated in superRefine)
  hooks: z.any().optional(),
}).passthrough();

export const OTAConfigSchema = OTAConfigBaseSchema.superRefine((config, ctx) => {
  const channelSet = new Set(config.channels);

  // Ensure channels are unique
  if (channelSet.size !== config.channels.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'channels must contain unique values',
      path: ['channels'],
    });
  }

  // Ensure defaultChannel belongs to channels
  if (!channelSet.has(config.defaultChannel)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `defaultChannel "${config.defaultChannel}" must exist in channels`,
      path: ['defaultChannel'],
    });
  }

  // file source requires filePath
  if (config.changelog.source === 'file' && !config.changelog.filePath) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'changelog.filePath is required when changelog.source is "file"',
      path: ['changelog', 'filePath'],
    });
  }

  const hooks = config.hooks as Record<string, unknown> | undefined;
  const hasGenerateVersion = typeof hooks?.generateVersion === 'function';
  const hasGenerateChangelog = typeof hooks?.generateChangelog === 'function';

  // custom version strategy requires hook
  if (config.versionStrategy === 'custom' && !hasGenerateVersion) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'hooks.generateVersion must be provided when versionStrategy is "custom"',
      path: ['hooks', 'generateVersion'],
    });
  }

  // custom changelog source requires hook
  if (config.changelog.source === 'custom' && !hasGenerateChangelog) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'hooks.generateChangelog must be provided when changelog.source is "custom"',
      path: ['hooks', 'generateChangelog'],
    });
  }

  const validateChannelMap = (map: Record<string, string>, path: string[]) => {
    for (const key of Object.keys(map)) {
      if (!channelSet.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Unknown channel "${key}" in ${path.join('.')}`,
          path,
        });
      }
    }
  };

  validateChannelMap(config.versionFormatByChannel, ['versionFormatByChannel']);
  validateChannelMap(config.channelAliases, ['channelAliases']);
  validateChannelMap(config.eas.messageFormatByChannel, ['eas', 'messageFormatByChannel']);
});

// ============================================================================
// Version Data Schema
// ============================================================================

export const OTAVersionDataSchema = z.object({
  version: z.string(),
  buildNumber: z.number().int().nonnegative(),
  releaseDate: z.string(),
  channel: z.string(),
  changelog: z.array(z.string()),
});

export type OTAVersionData = z.infer<typeof OTAVersionDataSchema>;

// ============================================================================
// Hook Types
// ============================================================================

export interface CustomVersionContext {
  currentVersion: OTAVersionData | null;
  channel: string;
  changelog: string[];
  cwd: string;
  buildNumber: number;
  baseVersion: string;
  parsedBaseVersion: { major: number; minor: number; patch: number };
  templateVars: VersionTemplateVariables;
  defaultVersion: string;
}

export interface CustomChangelogContext {
  currentVersion: OTAVersionData | null;
  channel: string;
  cwd: string;
}

export interface BeforePublishContext {
  currentVersion: OTAVersionData | null;
  channel: string;
  changelog: string[];
  dryRun: boolean;
  cwd: string;
}

export interface BeforePublishResult {
  changelog?: string[];
  version?: string | Partial<OTAVersionData>;
  message?: string;
}

export interface AfterPublishContext {
  channel: string;
  message: string;
  cwd: string;
  dryRun: boolean;
}

export interface ErrorContext {
  channel?: string;
  cwd: string;
}

export interface OTAHooks {
  beforePublish?: (
    context: BeforePublishContext
  ) => Promise<void | BeforePublishResult> | void | BeforePublishResult;
  afterPublish?: (
    version: OTAVersionData,
    context: AfterPublishContext
  ) => Promise<void> | void;
  onError?: (error: Error, context: ErrorContext) => Promise<void> | void;
  generateVersion?: (
    context: CustomVersionContext
  ) => Promise<string | Partial<OTAVersionData> | OTAVersionData> | string | Partial<OTAVersionData> | OTAVersionData;
  generateChangelog?: (context: CustomChangelogContext) => Promise<string[]> | string[];
}

export type OTAConfig = z.infer<typeof OTAConfigSchema> & {
  hooks?: OTAHooks;
};

// ============================================================================
// Default Config
// ============================================================================

export const defaultConfig: OTAConfig = {
  versionFile: './ota-version.json',
  baseVersion: '1.0.0',
  versionFormat: '{major}.{minor}.{patch}-{channel}.{build}',
  versionFormatByChannel: {},
  versionStrategy: 'build',
  channelAliases: {},
  changelog: {
    source: 'git',
    commitCount: 10,
    format: 'short',
    includeAuthor: false,
  },
  eas: {
    autoPublish: true,
    messageFormat: 'v{version}: {firstChange}',
    messageFormatByChannel: {},
  },
  channels: ['development', 'preview', 'production'],
  defaultChannel: 'development',
};
