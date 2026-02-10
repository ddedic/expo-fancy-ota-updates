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

export interface RevertOptions {
  channel?: string;
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
    message: 'Select update group to republish:',
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

export async function revert(options: RevertOptions = {}): Promise<void> {
  const cwd = options.cwd || process.cwd();

  try {
    const config = await loadConfig(cwd);
    const channel = options.channel;
    const platform = normalizePlatform(options.platform);

    if (!channel) {
      throw new Error('Missing required option: --channel');
    }

    if (!config.channels.includes(channel)) {
      throw new Error(`Invalid channel: ${channel}. Available: ${config.channels.join(', ')}`);
    }

    let groupId = options.group;
    let branchName = channel;
    let selectedGroup: UpdateGroupSummary | undefined;

    if (!groupId) {
      const branchSpinner = ora(`Resolving branch for channel ${channel}...`).start();
      branchName = await resolveBranchFromChannel(channel, cwd);
      branchSpinner.succeed(`Resolved branch: ${branchName}`);

      const listSpinner = ora(`Loading recent updates for ${branchName}...`).start();
      const groups = await listRecentUpdateGroupsForBranch(branchName, cwd);
      listSpinner.succeed(`Found ${groups.length} update group(s)`);

      if (groups.length === 0) {
        throw new Error(`No update groups found for channel "${channel}"`);
      }

      groupId = await pickGroupInteractively(groups);
      selectedGroup = groups.find((group) => group.groupId === groupId);
    }

    const args = ['update:republish', '--group', groupId, '--destination-channel', channel, '--platform', platform];
    if (options.message) {
      args.push('--message', options.message);
    }

    console.log(chalk.bold(`\n↩ Reverting channel ${chalk.cyan(channel)}\n`));
    console.log(chalk.gray(`  Channel:      ${channel}`));
    console.log(chalk.gray(`  Branch:       ${branchName}`));
    console.log(chalk.gray(`  Group:        ${groupId}`));
    console.log(chalk.gray(`  Platform:     ${platform}`));
    if (selectedGroup?.runtimeVersions.length) {
      console.log(chalk.gray(`  Runtime:      ${selectedGroup.runtimeVersions.join(', ')}`));
    }

    if (options.dryRun) {
      console.log(chalk.yellow('\n[DRY RUN] Would execute:'));
      console.log(chalk.gray(`  ${formatEASCommand(args)}`));
      return;
    }

    if (!options.yes) {
      await confirmAction(`Republish group ${groupId} to channel "${channel}"?`);
    }

    const spinner = ora('Republishing update group...').start();
    await execa('eas', args, { cwd, stdio: 'inherit' });
    spinner.succeed(`Revert complete for channel ${channel}`);
  } catch (error: any) {
    console.error(chalk.red(`\n✖ Error: ${error.message}\n`));
    process.exit(1);
  }
}
