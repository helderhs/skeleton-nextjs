'use client';

import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme } from '@/lib/theme';
import type { ThemeMode } from '@/types';

export default function ThemeRegistry({
  children,
  initialMode,
}: {
  children: React.ReactNode;
  initialMode: ThemeMode;
}) {
  const theme = React.useMemo(() => getTheme(initialMode), [initialMode]);

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
