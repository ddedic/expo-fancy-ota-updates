import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Expo Fancy OTA Updates',
  description: 'Customizable OTA update UI components and CLI publishing tool for Expo apps',
  base: '/expo-fancy-ota-updates/',
  
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/getting-started' },
      { text: 'UI Components', link: '/ui-components/provider' },
      { text: 'CLI Tool', link: '/cli/overview' },
      { text: 'Showcase', link: '/examples/expo-showcase' },
      { text: 'Changelog', link: '/changelog' },
      { text: 'npm', link: 'https://www.npmjs.com/package/@ddedic/expo-fancy-ota-updates' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Installation', link: '/installation' },
          { text: 'Changelog', link: '/changelog' },
        ]
      },
      {
        text: 'UI Components',
        items: [
          { text: 'OTAUpdatesProvider', link: '/ui-components/provider' },
          { text: 'UpdateBanner', link: '/ui-components/banner' },
          { text: 'OTAInfoScreen', link: '/ui-components/info-screen' },
          { text: 'useOTAUpdates Hook', link: '/ui-components/hook' },
        ]
      },
      {
        text: 'CLI Tool',
        items: [
          { text: 'Overview', link: '/cli/overview' },
          { text: 'Commands', link: '/cli/commands' },
          { text: 'Configuration', link: '/cli/configuration' },
        ]
      },
      {
        text: 'Guides',
        items: [
          { text: 'Theming', link: '/guides/theming' },
          { text: 'Translations (i18n)', link: '/guides/i18n' },
          { text: 'Hooks System', link: '/guides/hooks' },
        ]
      },
      {
        text: 'Examples',
        items: [
          { text: 'Expo Showcase Demo', link: '/examples/expo-showcase' },
          { text: 'Complete Workflow', link: '/examples/workflow' },
          { text: 'Custom UI', link: '/examples/custom-ui' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ddedic/expo-fancy-ota-updates' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@ddedic/expo-fancy-ota-updates' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-2026 Danijel Dedic'
    },

    search: {
      provider: 'local'
    }
  }
})
