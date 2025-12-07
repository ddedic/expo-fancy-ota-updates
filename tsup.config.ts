import { defineConfig } from 'tsup';

export default defineConfig([
  // Main package (UI components)
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: [
      'react',
      'react-native',
      'expo',
      'expo-updates',
      'expo-device',
      'expo-linear-gradient',
      'react-native-reanimated',
      'react-native-safe-area-context',
      'lucide-react-native',
      'react-native-svg',
    ],
    treeshake: true,
    minify: false,
  },
  // CLI
  {
    entry: ['src/cli/index.ts'],
    format: ['esm'],
    dts: false,
    splitting: false,
    sourcemap: false,
    outDir: 'dist/cli',
    external: [
      'commander',
      'chalk',
      'ora',
      'prompts',
      'cosmiconfig',
      'zod',
      'execa',
    ],
    treeshake: true,
    minify: false,
    shims: true,
  },
]);
