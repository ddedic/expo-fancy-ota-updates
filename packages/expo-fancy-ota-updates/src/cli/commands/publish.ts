import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import { execa } from 'execa';
import { loadConfig } from '../config';
import { readVersionData, writeVersionData, incrementVersion, type VersionOverrides } from '../version';
import { generateChangelog } from '../changelog';
import { getChannelTemplate, renderTemplate } from '../template';
import {
  OTAVersionDataSchema,
  type OTAConfig,
  type OTAHooks,
  type OTAVersionData,
  type VersionStrategy,
} from '../schema';

type Platform = 'ios' | 'android';
const SUPPORTED_PLATFORMS: Platform[] = ['ios', 'android'];
const SUPPORTED_STRATEGIES: VersionStrategy[] = ['build', 'semver', 'date', 'custom'];

export interface PublishOptions {
  channel?: string;
  message?: string;
  dryRun?: boolean;
  noIncrement?: boolean;
  interactive?: boolean;
  cwd?: string;
  strategy?: VersionStrategy;
  versionFormat?: string;
  platforms?: Platform[];
}

/**
 * Validate EAS configuration
 */
async function validateEAS(cwd: string): Promise<boolean> {
  try {
    await execa('eas', ['--version'], { cwd });
    return true;
  } catch {
    return false;
  }
}

function normalizePlatforms(platforms?: string[] | Platform[]): Platform[] | undefined {
  if (!platforms || platforms.length === 0) {
    return undefined;
  }

  const unique = Array.from(new Set(platforms));
  const invalid = unique.filter((platform) => !SUPPORTED_PLATFORMS.includes(platform as Platform));

  if (invalid.length > 0) {
    throw new Error(
      `Invalid platform(s): ${invalid.join(', ')}. Supported: ${SUPPORTED_PLATFORMS.join(', ')}`
    );
  }

  return unique as Platform[];
}

function normalizeStrategy(strategy?: string): VersionStrategy | undefined {
  if (!strategy) {
    return undefined;
  }
  if (!SUPPORTED_STRATEGIES.includes(strategy as VersionStrategy)) {
    throw new Error(
      `Invalid strategy "${strategy}". Supported: ${SUPPORTED_STRATEGIES.join(', ')}`
    );
  }
  return strategy as VersionStrategy;
}

/**
 * Publish OTA update to EAS
 */
async function publishToEAS(
  channel: string,
  message: string,
  cwd: string,
  dryRun: boolean,
  platforms?: Platform[]
): Promise<void> {
  // Build args array
  const args = ['update', '--channel', channel, '--message', message];

  // Add platform flags if specified
  if (platforms && platforms.length > 0) {
    for (const platform of platforms) {
      args.push('--platform', platform);
    }
  }

  if (dryRun) {
    // Display with quoted message so spaces in changelog text are clear to users
    const displayArgs = ['update', '--channel', channel, '--message', `"${message}"`];
    if (platforms && platforms.length > 0) {
      for (const platform of platforms) {
        displayArgs.push('--platform', platform);
      }
    }
    console.log(chalk.yellow('\n[DRY RUN] Would execute:'));
    console.log(chalk.gray(`  eas ${displayArgs.join(' ')}`));
    return;
  }

  const spinner = ora('Publishing to EAS...').start();

  try {
    await execa('eas', args, {
      cwd,
      stdio: 'inherit',
    });
    spinner.succeed('Published to EAS');
  } catch (error: any) {
    spinner.fail('Failed to publish to EAS');
    throw error;
  }
}

function getChannelAlias(config: OTAConfig, channel: string): string {
  return config.channelAliases[channel] ?? channel;
}

function getMessageTemplate(config: OTAConfig, channel: string): string {
  return getChannelTemplate(channel, config.eas.messageFormat, config.eas.messageFormatByChannel);
}

/**
 * Format publish message
 */
function formatMessage(template: string, version: OTAVersionData, channelAlias: string): string {
  return renderTemplate(template, {
    version: version.version,
    channel: version.channel,
    channelAlias,
    build: version.buildNumber,
    firstChange: version.changelog[0] || 'Update',
    date: new Date(version.releaseDate).toLocaleDateString(),
  });
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function applyVersionOverride(
  version: OTAVersionData,
  override?: string | Partial<OTAVersionData>
): OTAVersionData {
  if (!override) {
    return version;
  }

  if (typeof override === 'string') {
    return OTAVersionDataSchema.parse({
      ...version,
      version: override,
    });
  }

  return OTAVersionDataSchema.parse({
    ...version,
    ...override,
    version: override.version ?? version.version,
    buildNumber: override.buildNumber ?? version.buildNumber,
    releaseDate: override.releaseDate ?? version.releaseDate,
    channel: override.channel ?? version.channel,
    changelog: override.changelog ?? version.changelog,
  });
}

/**
 * Interactive mode prompts
 */
async function runInteractive(config: OTAConfig): Promise<Partial<PublishOptions>> {
  const responses = await prompts([
    {
      type: 'select',
      name: 'channel',
      message: 'Select channel:',
      choices: config.channels.map((ch: string) => ({ title: ch, value: ch })),
      initial: config.channels.indexOf(config.defaultChannel),
    },
    {
      type: 'confirm',
      name: 'useGitChangelog',
      message: 'Use git commits for changelog?',
      initial: config.changelog.source === 'git',
    },
    {
      type: (prev: boolean) => (prev ? null : 'text'),
      name: 'customMessage',
      message: 'Enter custom changelog message:',
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Proceed with publish?',
      initial: true,
    },
  ]);

  if (!responses.confirm) {
    throw new Error('Publish cancelled by user');
  }

  return {
    channel: responses.channel,
    message: responses.customMessage,
  };
}

/**
 * Main publish command
 */
export async function publish(options: PublishOptions = {}): Promise<void> {
  const cwd = options.cwd || process.cwd();
  let targetChannel: string | undefined;

  try {
    // Load configuration
    const config = await loadConfig(cwd);
    const hooks = config.hooks as OTAHooks | undefined;

    // Interactive mode
    if (options.interactive) {
      const interactiveOpts = await runInteractive(config);
      options = { ...options, ...interactiveOpts };
    }

    // Determine channel
    const channel = options.channel || config.defaultChannel;
    targetChannel = channel;

    if (!config.channels.includes(channel)) {
      throw new Error(`Invalid channel: ${channel}. Available: ${config.channels.join(', ')}`);
    }

    // Determine platform list (CLI override > config file)
    const platforms = normalizePlatforms(options.platforms ?? config.eas.platforms);

    console.log(chalk.bold(`\n📦 Publishing OTA update to ${chalk.cyan(channel)}\n`));

    // Validate EAS
    if (config.eas.autoPublish && !options.dryRun) {
      const spinner = ora('Validating EAS configuration...').start();
      const isValid = await validateEAS(cwd);
      if (!isValid) {
        spinner.fail('EAS CLI not found or not configured');
        throw new Error('Please install EAS CLI: pnpm add -g eas-cli');
      }
      spinner.succeed('EAS configuration valid');
    }

    // Read current version
    const versionFilePath = path.join(cwd, config.versionFile);
    const currentVersion = await readVersionData(versionFilePath);

    if (currentVersion) {
      console.log(
        chalk.gray(`Current version: ${currentVersion.version} (build ${currentVersion.buildNumber})`)
      );
    }

    // Generate changelog
    let changelog: string[];
    if (options.message) {
      changelog = [options.message];
    } else {
      const spinner = ora('Generating changelog...').start();
      changelog = await generateChangelog(config, cwd, currentVersion, channel);
      spinner.succeed(`Generated changelog (${changelog.length} items)`);
    }

    let hookMessageOverride: string | undefined;
    let hookVersionOverride: string | Partial<OTAVersionData> | undefined;

    // Run beforePublish hook (with support for overrides)
    if (hooks?.beforePublish) {
      const spinner = ora('Running beforePublish hook...').start();
      try {
        const hookResult = await hooks.beforePublish({
          currentVersion,
          channel,
          changelog,
          dryRun: options.dryRun || false,
          cwd,
        });

        if (hookResult?.changelog !== undefined) {
          if (!isStringArray(hookResult.changelog)) {
            throw new Error('hooks.beforePublish result.changelog must be string[]');
          }
          changelog = hookResult.changelog;
        }

        if (hookResult?.message !== undefined) {
          hookMessageOverride = hookResult.message;
        }

        if (hookResult?.version !== undefined) {
          hookVersionOverride = hookResult.version;
        }

        spinner.succeed('beforePublish hook completed');
      } catch (error: any) {
        spinner.fail('beforePublish hook failed');
        throw error;
      }
    }

    // Increment version
    const versionOverrides: VersionOverrides = {
      strategy: normalizeStrategy(options.strategy),
      versionFormat: options.versionFormat,
    };

    let newVersion: OTAVersionData;
    if (options.noIncrement && currentVersion) {
      newVersion = OTAVersionDataSchema.parse({ ...currentVersion, changelog });
    } else {
      newVersion = await incrementVersion(
        currentVersion,
        channel,
        changelog,
        config,
        cwd,
        versionOverrides
      );
    }

    newVersion = applyVersionOverride(newVersion, hookVersionOverride);
    const channelAlias = getChannelAlias(config, channel);
    const messageTemplate = getMessageTemplate(config, channel);
    const computedMessage = formatMessage(messageTemplate, newVersion, channelAlias);
    const publishMessage = options.message || hookMessageOverride || computedMessage;

    // Display version info
    console.log(chalk.bold('\n📋 Version Information:'));
    console.log(chalk.gray(`  Version:      ${chalk.white(newVersion.version)}`));
    console.log(chalk.gray(`  Build:        ${chalk.white(newVersion.buildNumber)}`));
    console.log(chalk.gray(`  Channel:      ${chalk.white(newVersion.channel)}`));
    console.log(chalk.gray(`  Release Date: ${chalk.white(new Date(newVersion.releaseDate).toLocaleString())}`));

    console.log(chalk.bold('\n📝 Changelog:'));
    newVersion.changelog.slice(0, 5).forEach((item: string, i: number) => {
      console.log(chalk.gray(`  ${i + 1}. ${item}`));
    });
    if (newVersion.changelog.length > 5) {
      console.log(chalk.gray(`  ... and ${newVersion.changelog.length - 5} more`));
    }

    // Write version file
    if (!options.dryRun) {
      await writeVersionData(versionFilePath, newVersion);
      console.log(chalk.green(`\n✓ Updated ${config.versionFile}`));
    } else {
      console.log(chalk.yellow(`\n[DRY RUN] Would update ${config.versionFile}`));
    }

    // Publish to EAS
    if (config.eas.autoPublish) {
      await publishToEAS(channel, publishMessage, cwd, options.dryRun || false, platforms);
    }

    // Run afterPublish hook
    if (hooks?.afterPublish && !options.dryRun) {
      const spinner = ora('Running afterPublish hook...').start();
      try {
        await hooks.afterPublish(newVersion, {
          channel,
          message: publishMessage,
          cwd,
          dryRun: options.dryRun || false,
        });
        spinner.succeed('afterPublish hook completed');
      } catch (error: any) {
        spinner.warn('afterPublish hook failed (non-fatal)');
        console.error(error);
      }
    }

    console.log(chalk.bold.green(`\n✨ Successfully published ${newVersion.version}!\n`));
  } catch (error: any) {
    // Run onError hook
    const config = await loadConfig(cwd).catch(() => null);
    const hooks = config?.hooks as OTAHooks | undefined;
    if (hooks?.onError) {
      try {
        await hooks.onError(error as Error, { channel: targetChannel, cwd });
      } catch {
        // Ignore hook errors
      }
    }

    console.error(chalk.red(`\n✖ Error: ${error.message}\n`));
    process.exit(1);
  }
}
