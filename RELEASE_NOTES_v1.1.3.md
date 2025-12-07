# v1.1.3 - Documentation Site

Complete VitePress documentation is now live at https://ddedic.github.io/expo-fancy-ota-updates/

## What's New

### 📚 Documentation Site

- **15 comprehensive documentation pages**
  - Getting Started & Installation
  - UI Components (Provider, Banner, Info Screen, Hook)
  - CLI Tool (Commands, Configuration)
  - Guides (Theming, i18n, Hooks)
  - Examples (Workflow, Custom UI)

### 📝 Enhanced README

- Added documentation badge and links
- Dedicated Documentation section with quick links
- Better navigation to all resources

### 🚀 GitHub Actions

- Auto-deploy docs on every push to main
- Uses Bun for faster builds
- Automated deployment workflow

## Features

- 🎨 Beautiful VitePress theme
- 🔍 Built-in search functionality
- 📱 Mobile responsive design
- 📸 Screenshots showcase
- 🏆 Photo Trim sponsor section

## Links

- 📚 [Full Documentation](https://ddedic.github.io/expo-fancy-ota-updates/)
- 📦 [npm Package](https://www.npmjs.com/package/@ddedic/expo-fancy-ota-updates)
- 💻 [GitHub Repository](https://github.com/ddedic/expo-fancy-ota-updates)

## Installation

```bash
npm install @ddedic/expo-fancy-ota-updates
```

## Quick Start

```tsx
import { OTAUpdatesProvider, UpdateBanner } from '@ddedic/expo-fancy-ota-updates';

<OTAUpdatesProvider config={{ versionData }}>
  <UpdateBanner />
  <YourApp />
</OTAUpdatesProvider>
```

**Full Changelog**: https://github.com/ddedic/expo-fancy-ota-updates/compare/v1.1.0...v1.1.3
