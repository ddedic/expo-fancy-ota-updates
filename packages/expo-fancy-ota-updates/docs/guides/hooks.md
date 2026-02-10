# Hooks System

Hooks let you customize every publish phase.

## Supported Hooks

```javascript
export default {
  hooks: {
    beforePublish: async (context) => {},
    afterPublish: async (version, context) => {},
    onError: async (error, context) => {},
    generateVersion: async (context) => {},
    generateChangelog: async (context) => {},
  },
};
```

## Hook Signatures

### `beforePublish(context)`

Runs before version increment and publish.

`context`:

```ts
{
  currentVersion: OTAVersionData | null;
  channel: string;
  changelog: string[];
  dryRun: boolean;
  cwd: string;
}
```

Can return optional overrides:

```ts
{
  changelog?: string[];
  message?: string;
  version?: string | Partial<OTAVersionData>;
}
```

### `afterPublish(version, context)`

Runs after successful publish.

`version` is the final resolved version object.  
`context`:

```ts
{
  channel: string;
  message: string;
  cwd: string;
  dryRun: boolean;
}
```

### `onError(error, context)`

Runs on publish failure.

`context`:

```ts
{
  channel?: string;
  cwd: string;
}
```

### `generateVersion(context)`

Required when `versionStrategy: 'custom'`.

`context`:

```ts
{
  currentVersion: OTAVersionData | null;
  channel: string;
  changelog: string[];
  cwd: string;
  buildNumber: number;
  baseVersion: string;
  parsedBaseVersion: { major: number; minor: number; patch: number };
  templateVars: {
    major: number;
    minor: number;
    patch: number;
    channel: string;
    channelAlias: string;
    build: number;
    timestamp: string;
  };
  defaultVersion: string;
}
```

Return value:

- `string` (full version)
- `Partial<OTAVersionData>`
- full `OTAVersionData`

### `generateChangelog(context)`

Required when `changelog.source: 'custom'`.

`context`:

```ts
{
  currentVersion: OTAVersionData | null;
  channel: string;
  cwd: string;
}
```

Must return `string[]`.

## Practical Examples

### 1. Short Production Versions + Custom Message

```javascript
export default {
  hooks: {
    beforePublish: async ({ channel, changelog }) => {
      if (channel === 'production') {
        return {
          message: `prod release: ${changelog[0] || 'Update'}`,
        };
      }
    },
  },
};
```

### 2. Custom Version Strategy

```javascript
export default {
  versionStrategy: 'custom',
  hooks: {
    generateVersion: async ({ templateVars }) => {
      return `r${templateVars.major}.${templateVars.minor}.${templateVars.build}`;
    },
  },
};
```

### 3. Custom Changelog Source

```javascript
export default {
  changelog: {
    source: 'custom',
  },
  hooks: {
    generateChangelog: async ({ channel }) => {
      return [`Manual curated release for ${channel}`];
    },
  },
};
```

### 4. Validation Gate

```javascript
export default {
  hooks: {
    beforePublish: async ({ channel, changelog }) => {
      if (channel === 'production' && changelog.length === 0) {
        throw new Error('Production publish requires changelog entries');
      }
    },
  },
};
```

## Best Practices

1. Keep hooks deterministic and fast.
2. Throw errors only for hard-stop validation failures.
3. Use `beforePublish` return overrides sparingly and clearly.
4. Keep custom generators pure (no side effects when possible).
5. Use environment variables for secrets.

## Next Steps

- [CLI Configuration](/cli/configuration)
- [CLI Commands](/cli/commands)
- [Complete Workflow](/examples/workflow)

> Want to feel the package end-to-end first? Try the [Expo Showcase Demo](/apps/expo-showcase).
