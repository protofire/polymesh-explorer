import { Theme } from '@mui/material/styles';

const GlobalStyles = (theme: Theme) => {
  return {
    '*': {
      boxSizing: 'border-box',
      padding: '0',
      margin: '0',
    },
    'html, body': {
      scrollbarWidth: '8px',
      scrollbarColor: theme.palette.primary.main,
      overflowX: 'hidden',
      padding: '0 !important',
    },
    '::-webkit-scrollbar': {
      width: '8px',
    },

    '::-webkit-scrollbar-thumb': {
      background: theme.palette.primary.main,
      borderRadius: '8px',
    },

    '::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 1px',
      borderRadius: '0px',
    },
    a: {
      color: 'inherit',
      textDecoration: 'none',
    },
  };
};

export default GlobalStyles;
