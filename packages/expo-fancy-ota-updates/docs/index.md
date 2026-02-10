---
layout: home

hero:
  name: Expo Fancy OTA Updates
  text: Beautiful OTA Updates for Expo
  tagline: Customizable UI components and powerful CLI tool for seamless over-the-air updates
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: Try Expo Showcase
      link: /apps/expo-showcase
    - theme: alt
      text: View on GitHub
      link: https://github.com/ddedic/expo-fancy-ota-updates

features:
  - icon: 🎨
    title: Fully Customizable
    details: Theme colors, gradients, border radius, and animations. Make it match your brand perfectly.
  
  - icon: 🌍
    title: i18n Ready
    details: Built-in support for multiple languages. Pass your own translations or use English defaults.
  
  - icon: ✨
    title: Animated Banner
    details: Beautiful gradient banner with pulse animation that appears when updates are available.
  
  - icon: 📱
    title: Info Screen
    details: Full debug/info screen with changelog display, version details, and manual update controls.
  
  - icon: 🚀
    title: CLI Publishing Tool
    details: Powerful command-line tool for publishing OTA updates with version tracking and changelog generation.
  
  - icon: 📊
    title: Version Strategies
    details: Choose from build, semver, date, or fully custom version generation hooks.
  
  - icon: 📝
    title: Smart Changelog
    details: Auto-generate changelogs from git commits, manual input, files, or custom hooks.
  
  - icon: 🪝
    title: Hooks System
    details: Run custom logic before/after publishing with a flexible hooks system.

  - icon: ↩️
    title: Revert & Promote
    details: Safely roll back channels or promote tested updates between channels with dry-run and confirmations.
  
  - icon: 🎯
    title: Render Props
    details: Override any component with your own implementation using render props.

  - icon: 🧪
    title: Live Expo Demo
    details: Run the full interactive app from /apps/expo-showcase to preview behavior before integration.
---

<div style="text-align: center; margin: 3rem 0; padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px;">
  <h2 style="color: white; margin-bottom: 1rem;">🏆 Proudly Used In</h2>
  <a href="https://www.photo-trim.com" target="_blank" style="display: inline-block;">
    <img src="/logo.png?url" alt="Photo Trim" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 1rem;" />
  </a>
  <h3 style="color: white; margin: 0.5rem 0;">
    <a href="https://www.photo-trim.com" target="_blank" style="color: white; text-decoration: none;">Photo Trim — Smart Photo Library Cleaner</a>
  </h3>
  <p style="color: rgba(255,255,255,0.9); max-width: 600px; margin: 1rem auto;">
    See exactly what's eating your storage — and fix it in seconds. Discover large files, old media, and forgotten videos buried in both your device and iCloud.
  </p>
  <div style="margin-top: 1.5rem;">
    <a href="https://www.photo-trim.com" target="_blank" style="display: inline-block; background: white; color: #667eea; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 0 0.5rem;">🌐 Visit Website</a>
    <a href="https://apps.apple.com/app/id6755884114" target="_blank" style="display: inline-block; background: rgba(255,255,255,0.2); color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 0 0.5rem;">📱 Download on App Store</a>
  </div>
</div>

## 📸 Screenshots

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin: 2rem 0;">
  <div style="text-align: center;">
    <img src="/screenshots/screenshot-1.PNG?url" alt="Update Banner" style="width: 100%; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
    <p style="margin-top: 0.5rem; font-weight: 600;">Animated Update Banner</p>
    <p style="color: #666; font-size: 0.9rem;">Beautiful gradient with pulse animation</p>
  </div>
  <div style="text-align: center;">
    <img src="/screenshots/screenshot-2.PNG?url" alt="Download Progress" style="width: 100%; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
    <p style="margin-top: 0.5rem; font-weight: 600;">Download Progress</p>
    <p style="color: #666; font-size: 0.9rem;">Real-time download status</p>
  </div>
  <div style="text-align: center;">
    <img src="/screenshots/screenshot-4.PNG?url" alt="OTA Info Screen" style="width: 100%; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
    <p style="margin-top: 0.5rem; font-weight: 600;">OTA Info Screen</p>
    <p style="color: #666; font-size: 0.9rem;">Full debug & version details</p>
  </div>
</div>

<div style="text-align: center; margin: 2rem 0;">
  <img src="/screenshots/cli-screenshot.png?url" alt="CLI Tool" style="max-width: 80%; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
  <p style="margin-top: 1rem; font-weight: 600; font-size: 1.1rem;">Interactive CLI Publishing Tool</p>
  <p style="color: #666;">Publish OTA updates with guided prompts, version tracking, and changelog generation</p>
</div>

## Quick Example

::: code-group

```tsx [App.tsx]
import { OTAUpdatesProvider, UpdateBanner } from '@ddedic/expo-fancy-ota-updates';
import versionData from './ota-version.json';

export default function App() {
  return (
    <OTAUpdatesProvider config={{ versionData }}>
      <UpdateBanner />
      <YourApp />
    </OTAUpdatesProvider>
  );
}
```

```bash [CLI]
# Initialize configuration
npx ota-publish init

# Publish update
npx ota-publish --channel production
```

:::

## Why Choose This Package?

<div class="tip custom-block">
  <p class="custom-block-title">💡 Built for Real Apps</p>
  <p>Used in production by <a href="https://www.photo-trim.com" target="_blank">Photo Trim</a>, a popular iOS app for managing photo libraries.</p>
</div>

- **🎨 Beautiful by Default** — Stunning UI out of the box
- **⚡ Zero Config** — Works immediately with sensible defaults
- **🔧 Highly Configurable** — Customize everything when you need to
- **📦 Complete Solution** — UI components + CLI tool in one package
- **🎯 TypeScript First** — Full type safety and IntelliSense support
- **📚 Well Documented** — Comprehensive docs with examples

## Installation

::: code-group

```bash [bun]
pnpm add @ddedic/expo-fancy-ota-updates
```

```bash [npm]
pnpm add @ddedic/expo-fancy-ota-updates
```

```bash [yarn]
pnpm add @ddedic/expo-fancy-ota-updates
```

:::

[Get Started →](/getting-started)
