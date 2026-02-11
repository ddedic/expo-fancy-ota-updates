# Publishing Guide for @ddedic/expo-fancy-ota-updates

This guide walks you through publishing the package to npm.

## Prerequisites

1. **npm account** — Create one at [npmjs.com](https://www.npmjs.com/signup)
2. **npm organization** — Create `@ddedic` org at [npmjs.com/org/create](https://www.npmjs.com/org/create) (if not already created)
3. **npm login** — Login to npm CLI

## Step-by-Step Publishing

### 1. Login to npm

```bash
npm login
```

Follow the prompts to enter your username, password, and email.
If you have 2FA enabled, you'll need your authenticator code.

### 2. Verify the Package

Check what will be published:

```bash
cd /path/to/expo-fancy-ota-updates
npm pack --dry-run
```

This shows all files that will be included in the package.

### 3. Build the Package

```bash
bun run build
```

This creates the `dist/` folder with:
- `index.js` — CommonJS bundle
- `index.mjs` — ESM bundle  
- `index.d.ts` — TypeScript declarations

### 4. Publish to npm

For the first publish of a scoped package:

```bash
npm publish --access public
```

The `--access public` flag is required for scoped packages (`@ddedic/*`) the first time.

After the first publish, you can simply run:

```bash
npm publish
```

### 5. Verify Publication

Check your package at:
```
https://www.npmjs.com/package/@ddedic/expo-fancy-ota-updates
```

## Version Management

### Patch Release (bug fixes)
```bash
npm version patch  # 1.0.0 → 1.0.1
npm publish
```

### Minor Release (new features)
```bash
npm version minor  # 1.0.0 → 1.1.0
npm publish
```

### Major Release (breaking changes)
```bash
npm version major  # 1.0.0 → 2.0.0
npm publish
```

## Quick Publish Commands

```bash
# From the package directory
cd /path/to/expo-fancy-ota-updates

# Build and publish
bun run build && npm publish --access public
```

## Troubleshooting

### "You must be logged in to publish"
```bash
npm login
```

### "Package name already exists"
The package name `@ddedic/expo-fancy-ota-updates` is scoped, so it's unique to your org.

### "You do not have permission to publish"
Make sure you're a member of the `@ddedic` organization on npm with publish rights.

### "402 Payment Required"  
Scoped packages require `--access public` for free publishing.

## After Publishing

1. **Update the main app's package.json** to use the npm version:
   ```json
   "@ddedic/expo-fancy-ota-updates": "^1.0.0"
   ```

2. **Create a GitHub release** with the version tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

---

## Package Contents

The published package includes:

```
@ddedic/expo-fancy-ota-updates/
├── dist/
│   ├── index.js        # CommonJS
│   ├── index.mjs       # ESM
│   ├── index.d.ts      # Types (CJS)
│   └── index.d.mts     # Types (ESM)
├── src/                 # Source files
├── README.md
├── LICENSE
└── package.json
```
