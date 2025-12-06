import { defineConfig } from 'tsup';

export default defineConfig({
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
});
