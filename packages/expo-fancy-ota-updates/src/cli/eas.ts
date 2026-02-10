import { execa } from 'execa';

export type EASPlatform = 'ios' | 'android' | 'all';

export interface UpdateGroupSummary {
  groupId: string;
  createdAt: string | null;
  message: string | null;
  platforms: string[];
  runtimeVersions: string[];
  branchName: string | null;
  updatesCount: number;
}

function parseJSONOutput(stdout: string): any {
  const trimmed = stdout.trim();
  if (!trimmed) {
    return null;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    const lines = trimmed.split('\n').filter(Boolean);
    const lastLine = lines[lines.length - 1];
    return JSON.parse(lastLine);
  }
}

function normalizeList(data: any): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.updates)) return data.updates;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

function findStringByKeys(obj: any, keys: string[]): string | null {
  if (!obj || typeof obj !== 'object') return null;
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }
  return null;
}

function findStringDeep(obj: any, preferredKeys: string[]): string | null {
  if (!obj || typeof obj !== 'object') return null;

  const direct = findStringByKeys(obj, preferredKeys);
  if (direct) return direct;

  for (const value of Object.values(obj)) {
    if (value && typeof value === 'object') {
      const nested = findStringDeep(value, preferredKeys);
      if (nested) return nested;
    }
  }

  return null;
}

function findBranchFromChannelData(data: any): string | null {
  if (!data) return null;

  // Direct common shapes
  const direct =
    findStringByKeys(data, ['branch', 'branchName']) ||
    findStringByKeys(data?.updateBranch, ['name']) ||
    findStringByKeys(data?.branchMapping, ['branch', 'branchName']);
  if (direct) return direct;

  // branchMapping can be a JSON string
  if (typeof data?.branchMapping === 'string') {
    try {
      const parsed = JSON.parse(data.branchMapping);
      const fromMapping = findStringDeep(parsed, ['branchName', 'branch']);
      if (fromMapping) return fromMapping;
    } catch {
      // ignore malformed branchMapping
    }
  }

  return findStringDeep(data, ['branchName', 'branch']);
}

export async function runEASJson(args: string[], cwd: string): Promise<any> {
  const { stdout } = await execa('eas', [...args, '--json', '--non-interactive'], { cwd });
  return parseJSONOutput(stdout);
}

export async function resolveBranchFromChannel(channel: string, cwd: string): Promise<string> {
  const channelData = await runEASJson(['channel:view', channel], cwd);
  const branchName = findBranchFromChannelData(channelData);
  return branchName || channel;
}

export async function listRecentUpdateGroupsForBranch(
  branch: string,
  cwd: string,
  limit: number = 20
): Promise<UpdateGroupSummary[]> {
  const raw = await runEASJson(
    ['update:list', '--branch', branch, '--platform', 'all', '--limit', String(limit)],
    cwd
  );
  const updates = normalizeList(raw);

  const byGroup = new Map<string, UpdateGroupSummary>();

  for (const update of updates) {
    const groupId = findStringByKeys(update, ['group', 'groupId', 'updateGroup', 'updateGroupId']);
    if (!groupId) continue;

    const platform = findStringByKeys(update, ['platform']) ?? 'unknown';
    const runtimeVersion = findStringByKeys(update, ['runtimeVersion']) ?? 'unknown';
    const message = findStringByKeys(update, ['message']);
    const createdAt = findStringByKeys(update, ['createdAt', 'created', 'publishedAt']);
    const branchName = findStringByKeys(update, ['branch', 'branchName']);

    const existing = byGroup.get(groupId);
    if (!existing) {
      byGroup.set(groupId, {
        groupId,
        createdAt,
        message,
        platforms: [platform],
        runtimeVersions: [runtimeVersion],
        branchName,
        updatesCount: 1,
      });
      continue;
    }

    if (!existing.platforms.includes(platform)) existing.platforms.push(platform);
    if (!existing.runtimeVersions.includes(runtimeVersion)) existing.runtimeVersions.push(runtimeVersion);
    if (!existing.message && message) existing.message = message;
    if (!existing.createdAt && createdAt) existing.createdAt = createdAt;
    if (!existing.branchName && branchName) existing.branchName = branchName;
    existing.updatesCount += 1;
  }

  const groups = Array.from(byGroup.values());
  groups.sort((a, b) => {
    const aTs = a.createdAt ? Date.parse(a.createdAt) : 0;
    const bTs = b.createdAt ? Date.parse(b.createdAt) : 0;
    return bTs - aTs;
  });

  return groups;
}

export function formatEASCommand(args: string[]): string {
  return `eas ${args.map((arg) => (arg.includes(' ') ? `"${arg}"` : arg)).join(' ')}`;
}

