import { Button, Select, styled } from '@mui/material';

export const NetworkSelect = styled(Select)(({ theme }) => ({
  color: '#fff',
  backgroundColor: theme.palette.primary.main,
  borderRadius: '16px',
  minWidth: '120px',
  height: '32px',
  '.MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&:hover': {
    backgroundColor: `${theme.palette.primary.main}95`,
  },
  '&.Mui-focused': {
    backgroundColor: `${theme.palette.primary.main}98`,
  },
  '.MuiSelect-select': {
    paddingTop: '8px',
    paddingBottom: '8px',
  },
  '.MuiSvgIcon-root': {
    color: '#fff',
  },
}));

export const NetworkSelectLoading = styled(Button)(({ theme }) => ({
  color: '#fff',
  backgroundColor: theme.palette.primary.main,
  borderRadius: '16px',
  minWidth: '120px',
  height: '32px',
  '.MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&:hover': {
    backgroundColor: `${theme.palette.primary.main}95`,
  },
  '&.Mui-focused': {
    backgroundColor: `${theme.palette.primary.main}98`,
  },
  '.MuiSelect-select': {
    paddingTop: '8px',
    paddingBottom: '8px',
  },
  '.MuiSvgIcon-root': {
    color: '#fff',
  },
}));
