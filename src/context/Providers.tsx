'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { CustomMuiThemeProvider } from '@/theme/CustomMuiThemeProvider';
import { PolymeshSdkProvider } from './PolymeshSdkProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <CustomMuiThemeProvider>
        <QueryClientProvider client={queryClient}>
          <PolymeshSdkProvider>{children}</PolymeshSdkProvider>
        </QueryClientProvider>
      </CustomMuiThemeProvider>
    </AppRouterCacheProvider>
  );
}
