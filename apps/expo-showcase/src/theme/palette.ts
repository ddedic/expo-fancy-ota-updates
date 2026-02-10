import { useColorScheme } from 'react-native';

export type Palette = {
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  textFaint: string;
  border: string;
  accent: string;
  accentSoft: string;
  success: string;
  warning: string;
  error: string;
};

const lightPalette: Palette = {
  background: '#F6F5F2',
  surface: '#FFFFFF',
  surfaceMuted: '#EEEAE3',
  text: '#1F1D1A',
  textMuted: '#5A5145',
  textFaint: '#9C9182',
  border: '#E1D8CC',
  accent: '#2A5BFF',
  accentSoft: '#D6E0FF',
  success: '#1EAF6F',
  warning: '#F59D0C',
  error: '#E14F4F',
};

const darkPalette: Palette = {
  background: '#0E0F12',
  surface: '#16181D',
  surfaceMuted: '#20232A',
  text: '#F7F4EE',
  textMuted: '#B2AC9F',
  textFaint: '#7E776C',
  border: '#2A2D34',
  accent: '#6AD4FF',
  accentSoft: '#20394A',
  success: '#28C76F',
  warning: '#F2B94B',
  error: '#FF6B6B',
};

export function usePalette(): Palette {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkPalette : lightPalette;
}
