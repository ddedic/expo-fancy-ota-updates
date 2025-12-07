import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import { execa } from 'execa';
import { loadConfig } from '../config';
import { readVersionData, writeVersionData, incrementVersion } from '../version';
import { generateChangelog } from '../changelog';
import type { OTAConfig, OTAVersionData } from '../schema';

export interface PublishOptions {
  channel?: string;
  message?: string;
  dryRun?: boolean;
  noIncrement?: boolean;
  interactive?: boolean;
  cwd?: string;
}

/**
 * Validate EAS configuration
 */
async function validateEAS(cwd: string): Promise<boolean> {
  try {
    // Check if eas.json exists
    const { execa: execaSync } = await import('execa');
    await execaSync('eas', ['--version'], { cwd });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Publish OTA update to EAS
 */
async function publishToEAS(
  channel: string,
  message: string,
  cwd: string,
  dryRun: boolean
): Promise<void> {
  if (dryRun) {
    console.log(chalk.yellow('\n[DRY RUN] Would execute:'));
    console.log(chalk.gray(`  eas update --channel ${channel} --message "${message}"`));
    return;
  }
  
  const spinner = ora('Publishing to EAS...').start();
  
  try {
    await execa('eas', ['update', '--channel', channel, '--message', message], {
      cwd,
      stdio: 'inherit',
    });
    spinner.succeed('Published to EAS');
  } catch (error: any) {
    spinner.fail('Failed to publish to EAS');
    throw error;
  }
}

/**
 * Format publish message
 */
function formatMessage(template: string, version: OTAVersionData): string {
  return template
    .replace('{version}', version.version)
    .replace('{channel}', version.channel)
    .replace('{build}', version.buildNumber.toString())
    .replace('{firstChange}', version.changelog[0] || 'Update')
    .replace('{date}', new Date(version.releaseDate).toLocaleDateString());
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
      type: (prev: boolean) => prev ? null : 'text',
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
  
  try {
    // Load configuration
    const config = await loadConfig(cwd);
    
    // Interactive mode
    if (options.interactive) {
      const interactiveOpts = await runInteractive(config);
      options = { ...options, ...interactiveOpts };
    }
    
    // Determine channel
    const channel = options.channel || config.defaultChannel;
    
    if (!config.channels.includes(channel)) {
      throw new Error(`Invalid channel: ${channel}. Available: ${config.channels.join(', ')}`);
    }
    
    console.log(chalk.bold(`\n📦 Publishing OTA update to ${chalk.cyan(channel)}\n`));
    
    // Validate EAS
    if (config.eas.autoPublish && !options.dryRun) {
      const spinner = ora('Validating EAS configuration...').start();
      const isValid = await validateEAS(cwd);
      if (!isValid) {
        spinner.fail('EAS CLI not found or not configured');
        throw new Error('Please install EAS CLI: npm install -g eas-cli');
      }
      spinner.succeed('EAS configuration valid');
    }
    
    // Read current version
    const versionFilePath = path.join(cwd, config.versionFile);
    const currentVersion = await readVersionData(versionFilePath);
    
    if (currentVersion) {
      console.log(chalk.gray(`Current version: ${currentVersion.version} (build ${currentVersion.buildNumber})`));
    }
    
    // Generate changelog
    let changelog: string[];
    if (options.message) {
      changelog = [options.message];
    } else {
      const spinner = ora('Generating changelog...').start();
      changelog = await generateChangelog(config);
      spinner.succeed(`Generated changelog (${changelog.length} items)`);
    }
    
    // Run beforePublish hook
    if (config.hooks?.beforePublish) {
      const spinner = ora('Running beforePublish hook...').start();
      try {
        await config.hooks.beforePublish({ currentVersion, channel, changelog });
        spinner.succeed('beforePublish hook completed');
      } catch (error: any) {
        spinner.fail('beforePublish hook failed');
        throw error;
      }
    }
    
    // Increment version
    let newVersion: OTAVersionData;
    if (options.noIncrement && currentVersion) {
      newVersion = { ...currentVersion, changelog };
    } else {
      newVersion = await incrementVersion(currentVersion, channel, changelog, config, cwd);
    }
    
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
      const message = options.message || formatMessage(config.eas.messageFormat, newVersion);
      await publishToEAS(channel, message, cwd, options.dryRun || false);
    }
    
    // Run afterPublish hook
    if (config.hooks?.afterPublish && !options.dryRun) {
      const spinner = ora('Running afterPublish hook...').start();
      try {
        await config.hooks.afterPublish(newVersion);
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
    if (config?.hooks?.onError) {
      try {
        await config.hooks.onError(error);
      } catch {
        // Ignore hook errors
      }
    }
    
    console.error(chalk.red(`\n✖ Error: ${error.message}\n`));
    process.exit(1);
  }
}
