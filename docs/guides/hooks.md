# Hooks System

Run custom logic at different stages of the OTA publishing process.

## Overview

Hooks allow you to:
- ✅ Run tests before publishing
- ✅ Send notifications after publishing
- ✅ Handle errors gracefully
- ✅ Integrate with CI/CD
- ✅ Update documentation
- ✅ Track analytics

## Configuration

Add hooks to `ota-updates.config.js`:

```javascript
export default {
  hooks: {
    beforePublish: async (context) => {
      // Runs before publishing
    },
    afterPublish: async (version) => {
      // Runs after successful publish
    },
    onError: async (error) => {
      // Runs on publish error
    },
  },
};
```

## Hook Types

### `beforePublish`

Runs before the update is published.

**Parameters:**
```typescript
{
  currentVersion: OTAVersionData | null;
  channel: string;
  changelog: string[];
}
```

**Example:**
```javascript
beforePublish: async ({ currentVersion, channel, changelog }) => {
  console.log(`Publishing to ${channel}...`);
  console.log(`Current version: ${currentVersion?.version}`);
  console.log(`Changes: ${changelog.length} items`);
  
  // Run tests
  await execa('npm', ['test']);
  
  // Run linting
  await execa('npm', ['run', 'lint']);
  
  // Validate changelog
  if (changelog.length === 0) {
    throw new Error('Changelog cannot be empty');
  }
}
```

### `afterPublish`

Runs after successful publish.

**Parameters:**
```typescript
{
  version: string;
  buildNumber: number;
  releaseDate: string;
  channel: string;
  changelog: string[];
}
```

**Example:**
```javascript
afterPublish: async (version) => {
  console.log(`✓ Published ${version.version}`);
  
  // Send Slack notification
  await fetch('https://hooks.slack.com/...', {
    method: 'POST',
    body: JSON.stringify({
      text: `🚀 New OTA update published!\nVersion: ${version.version}\nChannel: ${version.channel}`,
    }),
  });
  
  // Update CHANGELOG.md
  const changelog = `## ${version.version} - ${new Date().toISOString().split('T')[0]}\n\n${version.changelog.map(c => `- ${c}`).join('\n')}\n\n`;
  await fs.appendFile('CHANGELOG.md', changelog);
}
```

### `onError`

Runs when publish fails.

**Parameters:**
```typescript
Error
```

**Example:**
```javascript
onError: async (error) => {
  console.error('Publish failed:', error.message);
  
  // Send error alert
  await fetch('https://hooks.slack.com/...', {
    method: 'POST',
    body: JSON.stringify({
      text: `❌ OTA publish failed!\nError: ${error.message}`,
    }),
  });
  
  // Log to error tracking
  await Sentry.captureException(error);
}
```

## Common Use Cases

### Run Tests

```javascript
beforePublish: async () => {
  const { execa } = await import('execa');
  
  console.log('Running tests...');
  await execa('npm', ['test']);
  
  console.log('Running type check...');
  await execa('npm', ['run', 'typecheck']);
}
```

### Send Notifications

```javascript
afterPublish: async (version) => {
  // Slack
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `🚀 OTA Update Published`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Version:* ${version.version}\n*Channel:* ${version.channel}\n*Changes:*\n${version.changelog.map(c => `• ${c}`).join('\n')}`,
          },
        },
      ],
    }),
  });
  
  // Discord
  await fetch(process.env.DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: `🚀 New OTA update: ${version.version}`,
      embeds: [{
        title: 'Changelog',
        description: version.changelog.join('\n'),
      }],
    }),
  });
}
```

### Update Documentation

```javascript
afterPublish: async (version) => {
  const fs = await import('fs/promises');
  
  // Update CHANGELOG.md
  const date = new Date().toISOString().split('T')[0];
  const entry = `## [${version.version}] - ${date}\n\n${version.changelog.map(c => `- ${c}`).join('\n')}\n\n`;
  
  const changelog = await fs.readFile('CHANGELOG.md', 'utf-8');
  await fs.writeFile('CHANGELOG.md', entry + changelog);
  
  // Commit and push
  const { execa } = await import('execa');
  await execa('git', ['add', 'CHANGELOG.md', 'ota-version.json']);
  await execa('git', ['commit', '-m', `chore: release ${version.version}`]);
  await execa('git', ['push']);
}
```

### Track Analytics

```javascript
afterPublish: async (version) => {
  // Track in analytics
  await fetch('https://api.analytics.com/events', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.ANALYTICS_TOKEN}` },
    body: JSON.stringify({
      event: 'ota_publish',
      properties: {
        version: version.version,
        channel: version.channel,
        buildNumber: version.buildNumber,
        changelogItems: version.changelog.length,
      },
    }),
  });
}
```

### Validate Before Publish

```javascript
beforePublish: async ({ channel, changelog }) => {
  // Production requires approval
  if (channel === 'production') {
    const prompts = await import('prompts');
    const { confirmed } = await prompts({
      type: 'confirm',
      name: 'confirmed',
      message: 'Publishing to PRODUCTION. Are you sure?',
      initial: false,
    });
    
    if (!confirmed) {
      throw new Error('Publish cancelled');
    }
  }
  
  // Require meaningful changelog
  if (changelog.some(c => c.toLowerCase().includes('wip'))) {
    throw new Error('Remove WIP items from changelog');
  }
}
```

### Environment-Specific Logic

```javascript
beforePublish: async ({ channel }) => {
  const { execa } = await import('execa');
  
  if (channel === 'production') {
    // Production: Run full test suite
    await execa('npm', ['run', 'test:e2e']);
  } else {
    // Dev/Preview: Quick tests only
    await execa('npm', ['run', 'test:unit']);
  }
}
```

## Error Handling

Hooks can throw errors to stop the publish:

```javascript
beforePublish: async () => {
  const { execa } = await import('execa');
  
  try {
    await execa('npm', ['test']);
  } catch (error) {
    throw new Error('Tests failed. Fix tests before publishing.');
  }
}
```

## Async/Await

All hooks support async/await:

```javascript
afterPublish: async (version) => {
  // Sequential
  await sendSlackNotification(version);
  await updateChangelog(version);
  await gitCommitAndPush();
  
  // Parallel
  await Promise.all([
    sendSlackNotification(version),
    sendDiscordNotification(version),
    trackAnalytics(version),
  ]);
}
```

## Best Practices

1. **Keep Hooks Fast** — Don't block publishing unnecessarily
2. **Handle Errors** — Use try/catch for non-critical operations
3. **Use Environment Variables** — For API keys and secrets
4. **Log Progress** — Help debug issues
5. **Test Hooks** — Ensure they work before relying on them

## Next Steps

- [CLI Configuration →](/cli/configuration)
- [Complete Workflow →](/examples/workflow)
