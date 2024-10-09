'use client';

import { Poppins } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const poppins = Poppins({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    primary: { main: '#FF2E72' },
    mode: 'dark',
  },
  typography: {
    fontFamily: poppins.style.fontFamily,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#00000011',
          borderRadius: '1rem',
          padding: '0.6rem',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
        },
      },
    },
  },
});

export default theme;
