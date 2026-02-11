export function formatIsoDate(value?: string | null): string {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString();
}

export function formatTimestamp(value?: Date | null): string {
  if (!value) return 'Never';
  return value.toLocaleTimeString();
}
