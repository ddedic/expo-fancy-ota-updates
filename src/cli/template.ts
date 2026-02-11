export type TemplateValue = string | number | undefined | null;

/**
 * Replace all template variables in the form of {variableName}.
 * Unknown variables are kept as-is to avoid accidentally deleting user input.
 */
export function renderTemplate<TValues extends object>(
  template: string,
  values: TValues
): string {
  const valueMap = values as Record<string, TemplateValue>;
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (fullMatch, key: string) => {
    const value = valueMap[key];
    if (value === undefined || value === null) {
      return fullMatch;
    }
    return String(value);
  });
}

export function getChannelTemplate(
  channel: string,
  fallbackTemplate: string,
  channelTemplates?: Record<string, string>
): string {
  if (!channelTemplates) {
    return fallbackTemplate;
  }
  return channelTemplates[channel] ?? fallbackTemplate;
}
