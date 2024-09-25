'use client';

import { Poppins } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

// const poppins = Poppins({
//   weight: ['300', '400', '500', '700'],
//   subsets: ['latin'],
//   display: 'swap',
// });

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: 'var(--font-poppins)',
  },
});

export default theme;
