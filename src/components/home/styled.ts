import { Box, styled } from '@mui/material';

export const CustomBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
  color: '#fff',
  marginTop: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    marginTop: theme.spacing(12),
  },
}));
