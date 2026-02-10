#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { publish } from './commands/publish';
import { init } from './commands/init';
import { revert } from './commands/revert';
import { promote } from './commands/promote';
import type { VersionStrategy } from './schema';

const program = new Command();

program
  .name('ota-publish')
  .description('Publish OTA updates for Expo apps with version tracking')
  .version('1.4.0');

function collectPlatforms(value: string, previous: string[] = []): string[] {
  return [...previous, value];
}

// Publish command (default)
program
  .command('publish', { isDefault: true })
  .description('Publish an OTA update')
  .option('-c, --channel <channel>', 'Target channel (development, preview, production)')
  .option('-m, --message <message>', 'Custom changelog message')
  .option(
    '-s, --strategy <strategy>',
    'Override version strategy for this run (build, semver, date, custom)',
    (value: string) => value as VersionStrategy
  )
  .option('--version-format <template>', 'Override version format template for this run')
  .option(
    '-p, --platform <platform>',
    'Target platform (ios or android). Use multiple times for both.',
    collectPlatforms,
    []
  )
  .option('--dry-run', 'Show what would be published without actually publishing')
  .option('--no-increment', 'Skip version increment')
  .option('-i, --interactive', 'Interactive mode with prompts')
  .action(async (options) => {
    await publish({
      ...options,
      platforms: options.platform,
    });
  });

// Init command
program
  .command('init')
  .description('Initialize OTA updates configuration')
  .action(async () => {
    await init();
  });

// Revert command
program
  .command('revert')
  .description('Republish a previous update group to a channel (rollback)')
  .requiredOption('-c, --channel <channel>', 'Channel to revert')
  .option('-g, --group <groupId>', 'Update group ID to republish')
  .option('-m, --message <message>', 'Republish message')
  .option('-p, --platform <platform>', 'Target platform (ios, android, all)', 'all')
  .option('--dry-run', 'Show what would be executed without publishing')
  .option('-y, --yes', 'Skip confirmation prompt')
  .action(async (options) => {
    await revert(options);
  });

// Promote command
program
  .command('promote')
  .description('Promote an update group from one channel to another')
  .requiredOption('--from <channel>', 'Source channel')
  .requiredOption('--to <channel>', 'Destination channel')
  .option('-g, --group <groupId>', 'Update group ID to promote')
  .option('-m, --message <message>', 'Republish message')
  .option('-p, --platform <platform>', 'Target platform (ios, android, all)', 'all')
  .option('--dry-run', 'Show what would be executed without publishing')
  .option('-y, --yes', 'Skip confirmation prompt')
  .action(async (options) => {
    await promote(options);
  });

// Parse arguments
program.parse();
