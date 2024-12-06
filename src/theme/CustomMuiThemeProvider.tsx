import { GlobalStyles } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import React from 'react';

import theme from '@/theme/index';
import GlobalStyling from '@/theme/GlobalStyling';

export function CustomMuiThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={() => GlobalStyling(theme) as never} />
      {children}
    </MuiThemeProvider>
  );
}
