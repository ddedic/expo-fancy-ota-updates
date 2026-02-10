import type { OTAInfoScreenProps } from '../../types';

export interface CommitInfo {
  type: string;
  scope?: string;
  message: string;
  original: string;
}

export function parseCommitMessage(log: string): CommitInfo {
  // Regex for conventional commits: type(scope)!: message
  const match = log.match(/^([a-z]+)(?:\(([^)]+)\))?(!)?: (.+)$/);
  
  if (!match) {
    return { type: 'update', message: log, original: log };
  }
  
  return {
    type: match[1].toLowerCase(),
    scope: match[2],
    message: match[4], // skip bang match[3]
    original: log,
  };
}

export function getCommitBadge(type: string, colors: any) {
  switch (type) {
    case 'feat':
    case 'feature':
      return { bg: colors.primary + '20', text: colors.primary, label: 'FEAT' };
    case 'fix':
    case 'bug':
      return { bg: colors.error + '20', text: colors.error, label: 'FIX' };
    case 'perf':
      return { bg: colors.success + '20', text: colors.success, label: 'PERF' };
    case 'refactor':
      return { bg: colors.warning + '20', text: colors.warning, label: 'REFACTOR' };
    case 'chore':
      return { bg: colors.textSecondary + '20', text: colors.textSecondary, label: 'CHORE' };
    case 'docs':
      return { bg: colors.textSecondary + '20', text: colors.textSecondary, label: 'DOCS' };
    default:
      return { bg: colors.textSecondary + '15', text: colors.textSecondary, label: 'UPDATE' };
  }
}

export function getVisibility(props: OTAInfoScreenProps) {
  const { 
    mode = 'developer',
    showRuntimeVersion,
    showOtaVersion,
    showReleaseDate,
    showUpdateId,
    showChannel,
    showChangelog,
    showCheckButton,
    showDownloadButton,
    showReloadButton,
    showDebugSection,
    hideDebug,
  } = props;

  const isUserMode = mode === 'user';
  
  return {
    runtimeVersion: showRuntimeVersion ?? true,
    otaVersion: showOtaVersion ?? true,
    releaseDate: showReleaseDate ?? true,
    updateId: showUpdateId ?? !isUserMode,
    channel: showChannel ?? true,
    changelog: showChangelog ?? true,
    checkButton: showCheckButton ?? true,
    downloadButton: showDownloadButton ?? true,
    reloadButton: showReloadButton ?? true,
    debugSection: showDebugSection ?? (hideDebug !== undefined ? !hideDebug : !isUserMode),
  };
}
