import type { PropsWithChildren } from 'react';
import React, { createContext, useContext, useMemo, useState } from 'react';

import { usePalette } from '@/theme/palette';

export type InfoMode = 'developer' | 'user';

type ShowcaseSettings = {
  infoMode: InfoMode;
  useCustomBanner: boolean;
  useCustomInfoRenderer: boolean;
  toggleCustomBanner: () => void;
  toggleCustomInfoRenderer: () => void;
  setInfoMode: (mode: InfoMode) => void;
  palette: ReturnType<typeof usePalette>;
};

const ShowcaseSettingsContext = createContext<ShowcaseSettings | null>(null);

export function ShowcaseSettingsProvider({ children }: PropsWithChildren) {
  const palette = usePalette();
  const [infoMode, setInfoMode] = useState<InfoMode>('developer');
  const [useCustomBanner, setUseCustomBanner] = useState(false);
  const [useCustomInfoRenderer, setUseCustomInfoRenderer] = useState(false);

  const value = useMemo(
    () => ({
      infoMode,
      useCustomBanner,
      useCustomInfoRenderer,
      toggleCustomBanner: () => setUseCustomBanner((prev) => !prev),
      toggleCustomInfoRenderer: () => setUseCustomInfoRenderer((prev) => !prev),
      setInfoMode,
      palette,
    }),
    [infoMode, palette, useCustomBanner, useCustomInfoRenderer]
  );

  return <ShowcaseSettingsContext.Provider value={value}>{children}</ShowcaseSettingsContext.Provider>;
}

export function useShowcaseSettings(): ShowcaseSettings {
  const context = useContext(ShowcaseSettingsContext);
  if (!context) {
    throw new Error('useShowcaseSettings must be used within ShowcaseSettingsProvider');
  }
  return context;
}
