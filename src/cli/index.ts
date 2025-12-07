#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { publish } from './commands/publish';
import { init } from './commands/init';

const program = new Command();

program
  .name('ota-publish')
  .description('Publish OTA updates for Expo apps with version tracking')
  .version('1.0.0');

// Publish command (default)
program
  .command('publish', { isDefault: true })
  .description('Publish an OTA update')
  .option('-c, --channel <channel>', 'Target channel (development, preview, production)')
  .option('-m, --message <message>', 'Custom changelog message')
  .option('--dry-run', 'Show what would be published without actually publishing')
  .option('--no-increment', 'Skip version increment')
  .option('-i, --interactive', 'Interactive mode with prompts')
  .action(async (options) => {
    await publish(options);
  });

// Init command
program
  .command('init')
  .description('Initialize OTA updates configuration')
  .action(async () => {
    await init();
  });

// Parse arguments
program.parse();
