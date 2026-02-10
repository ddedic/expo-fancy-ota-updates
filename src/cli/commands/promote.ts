import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import { execa } from 'execa';
import { loadConfig } from '../config';
import {
  EASPlatform,
  formatEASCommand,
  listRecentUpdateGroupsForBranch,
  resolveBranchFromChannel,
  type UpdateGroupSummary,
} from '../eas';

export interface PromoteOptions {
  from?: string;
  to?: string;
  group?: string;
  message?: string;
  platform?: EASPlatform;
  dryRun?: boolean;
  yes?: boolean;
  cwd?: string;
}

function normalizePlatform(platform: string | undefined): EASPlatform {
  const value = (platform || 'all') as EASPlatform;
  if (!['ios', 'android', 'all'].includes(value)) {
    throw new Error(`Invalid platform "${platform}". Supported: ios, android, all`);
  }
  return value;
}

function formatGroupChoice(group: UpdateGroupSummary): string {
  const date = group.createdAt ? new Date(group.createdAt).toLocaleString() : 'unknown date';
  const runtime = group.runtimeVersions[0] ?? 'unknown runtime';
  const message = group.message ?? 'No message';
  const preview = message.length > 60 ? `${message.slice(0, 57)}...` : message;
  return `${group.groupId.slice(0, 10)} | ${date} | ${runtime} | ${preview}`;
}

async function pickGroupInteractively(groups: UpdateGroupSummary[]): Promise<string> {
  const response = await prompts({
    type: 'select',
    name: 'groupId',
    message: 'Select update group to promote:',
    choices: groups.map((group) => ({
      title: formatGroupChoice(group),
      value: group.groupId,
    })),
    initial: 0,
  });

  if (!response.groupId) {
    throw new Error('No update group selected');
  }

  return response.groupId;
}

async function confirmAction(message: string): Promise<void> {
  const response = await prompts({
    type: 'confirm',
    name: 'confirmed',
    message,
    initial: false,
  });

  if (!response.confirmed) {
    throw new Error('Operation cancelled');
  }
}

export async function promote(options: PromoteOptions = {}): Promise<void> {
  const cwd = options.cwd || process.cwd();

  try {
    const config = await loadConfig(cwd);
    const from = options.from;
    const to = options.to;
    const platform = normalizePlatform(options.platform);

    if (!from) {
      throw new Error('Missing required option: --from');
    }
    if (!to) {
      throw new Error('Missing required option: --to');
    }
    if (from === to) {
      throw new Error('--from and --to must be different channels');
    }
    if (!config.channels.includes(from)) {
      throw new Error(`Invalid source channel: ${from}. Available: ${config.channels.join(', ')}`);
    }
    if (!config.channels.includes(to)) {
      throw new Error(`Invalid destination channel: ${to}. Available: ${config.channels.join(', ')}`);
    }

    let groupId = options.group;
    let sourceBranch = from;
    let selectedGroup: UpdateGroupSummary | undefined;

    if (!groupId) {
      const branchSpinner = ora(`Resolving branch for source channel ${from}...`).start();
      sourceBranch = await resolveBranchFromChannel(from, cwd);
      branchSpinner.succeed(`Resolved source branch: ${sourceBranch}`);

      const listSpinner = ora(`Loading recent updates for ${sourceBranch}...`).start();
      const groups = await listRecentUpdateGroupsForBranch(sourceBranch, cwd);
      listSpinner.succeed(`Found ${groups.length} update group(s)`);

      if (groups.length === 0) {
        throw new Error(`No update groups found for channel "${from}"`);
      }

      groupId = await pickGroupInteractively(groups);
      selectedGroup = groups.find((group) => group.groupId === groupId);
    }

    const args = [
      'update:republish',
      '--group',
      groupId,
      '--destination-channel',
      to,
      '--platform',
      platform,
    ];
    if (options.message) {
      args.push('--message', options.message);
    }

    console.log(chalk.bold(`\n⇄ Promoting update from ${chalk.cyan(from)} to ${chalk.cyan(to)}\n`));
    console.log(chalk.gray(`  Source Channel: ${from}`));
    console.log(chalk.gray(`  Source Branch:  ${sourceBranch}`));
    console.log(chalk.gray(`  Target Channel: ${to}`));
    console.log(chalk.gray(`  Group:          ${groupId}`));
    console.log(chalk.gray(`  Platform:       ${platform}`));
    if (selectedGroup?.runtimeVersions.length) {
      console.log(chalk.gray(`  Runtime:        ${selectedGroup.runtimeVersions.join(', ')}`));
    }

    if (options.dryRun) {
      console.log(chalk.yellow('\n[DRY RUN] Would execute:'));
      console.log(chalk.gray(`  ${formatEASCommand(args)}`));
      return;
    }

    if (!options.yes) {
      await confirmAction(`Promote group ${groupId} from "${from}" to "${to}"?`);
    }

    const spinner = ora('Promoting update group...').start();
    await execa('eas', args, { cwd, stdio: 'inherit' });
    spinner.succeed(`Promote complete: ${from} -> ${to}`);
  } catch (error: any) {
    console.error(chalk.red(`\n✖ Error: ${error.message}\n`));
    process.exit(1);
  }
}
