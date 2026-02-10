# Theming Guide

Customize the appearance of all UI components to match your brand.

## Quick Start

```tsx
import { OTAUpdatesProvider, defaultTheme } from '@ddedic/expo-fancy-ota-updates';

<OTAUpdatesProvider
  theme={{
    colors: {
      primary: '#6366F1',
      background: '#0B0B0F',
    },
  }}
>
```

## Theme Structure

```typescript
interface OTATheme {
  colors: {
    primary: string;
    primaryLight: string;
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  bannerGradient?: [string, string];
  borderRadius?: number;
  buttonBorderRadius?: number;
  animation?: {
    duration?: number;
    pulseDuration?: number;
  };
}
```

## Built-in Themes

### Default Theme (Dark)

```tsx
import { defaultTheme } from '@ddedic/expo-fancy-ota-updates';

<OTAUpdatesProvider theme={defaultTheme}>
```

**Colors:**
- Primary: Indigo (`#6366F1`)
- Background: Dark (`#0B0B0F`)
- Gradient: Indigo to Purple

### Light Theme

```tsx
import { lightTheme } from '@ddedic/expo-fancy-ota-updates';

<OTAUpdatesProvider theme={lightTheme}>
```

**Colors:**
- Primary: Blue (`#3B82F6`)
- Background: White (`#FFFFFF`)
- Gradient: Blue to Cyan

## Customization

### Partial Theme

You only need to specify the properties you want to change:

```tsx
<OTAUpdatesProvider
  theme={{
    colors: {
      primary: '#10B981', // Green
    },
  }}
>
```

The rest will use defaults.

### Complete Custom Theme

```tsx
const myTheme = {
  colors: {
    primary: '#EC4899',
    primaryLight: '#F472B6',
    background: '#1F2937',
    backgroundSecondary: '#374151',
    backgroundTertiary: '#4B5563',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textTertiary: '#9CA3AF',
    border: '#4B5563',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
  },
  bannerGradient: ['#EC4899', '#8B5CF6'],
  borderRadius: 16,
  buttonBorderRadius: 12,
  animation: {
    duration: 300,
    pulseDuration: 2000,
  },
};

<OTAUpdatesProvider theme={myTheme}>
```

### Extend Default Theme

```tsx
import { defaultTheme } from '@ddedic/expo-fancy-ota-updates';

const myTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: '#10B981',
    primaryLight: '#34D399',
  },
  borderRadius: 20,
};

<OTAUpdatesProvider theme={myTheme}>
```

## Dynamic Theming

### Based on Color Scheme

```tsx
import { useColorScheme } from 'react-native';
import { defaultTheme, lightTheme } from '@ddedic/expo-fancy-ota-updates';

function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? defaultTheme : lightTheme;
  
  return (
    <OTAUpdatesProvider theme={theme}>
      <YourApp />
    </OTAUpdatesProvider>
  );
}
```

### With Your App Theme

```tsx
import { useTheme } from './your-theme-context';

function App() {
  const { colors, isDark } = useTheme();
  
  return (
    <OTAUpdatesProvider
      theme={{
        colors: {
          primary: colors.primary,
          background: colors.background,
          text: colors.text,
          // Map your theme colors
        },
      }}
    >
      <YourApp />
    </OTAUpdatesProvider>
  );
}
```

## Theme Properties

### Colors

| Property | Description | Default (Dark) |
|----------|-------------|----------------|
| `primary` | Main brand color | `#6366F1` |
| `primaryLight` | Lighter variant | `#818CF8` |
| `background` | Screen background | `#0B0B0F` |
| `backgroundSecondary` | Card background | `#1A1A24` |
| `backgroundTertiary` | Elevated elements | `#2A2A3C` |
| `text` | Primary text | `#FFFFFF` |
| `textSecondary` | Secondary text | `#A1A1AA` |
| `textTertiary` | Tertiary text | `#71717A` |
| `border` | Border color | `#27272A` |
| `error` | Error state | `#EF4444` |
| `success` | Success state | `#10B981` |
| `warning` | Warning state | `#F59E0B` |

### Banner Gradient

```tsx
theme={{
  bannerGradient: ['#6366F1', '#8B5CF6'], // [start, end]
}}
```

`expo-linear-gradient` is optional. If not installed, banner uses a solid background fallback automatically.

### Border Radius

```tsx
theme={{
  borderRadius: 16,        // Cards, screens
  buttonBorderRadius: 12,  // Buttons
}}
```

### Animation

```tsx
theme={{
  animation: {
    duration: 300,      // Enter/exit animation (ms)
    pulseDuration: 2000, // Pulse cycle (ms)
  },
}}
```

## Examples

### Brand Colors

```tsx
// Match your brand
<OTAUpdatesProvider
  theme={{
    colors: {
      primary: '#FF6B6B',      // Your brand red
      primaryLight: '#FF8787',
    },
    bannerGradient: ['#FF6B6B', '#FFE66D'],
  }}
>
```

### Minimal/Flat Design

```tsx
<OTAUpdatesProvider
  theme={{
    borderRadius: 4,
    buttonBorderRadius: 4,
    bannerGradient: undefined, // No gradient
  }}
>
```

### High Contrast

```tsx
<OTAUpdatesProvider
  theme={{
    colors: {
      primary: '#FFFFFF',
      background: '#000000',
      text: '#FFFFFF',
      border: '#FFFFFF',
    },
  }}
>
```

## Next Steps

- [Translations (i18n) →](/guides/i18n)
- [Hooks System →](/guides/hooks)
- [Custom UI Example →](/examples/custom-ui)
