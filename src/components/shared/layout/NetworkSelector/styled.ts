import { Select, styled } from '@mui/material';

export const NetworkSelect = styled(Select)(() => ({
  marginLeft: 'auto',
  color: '#fff',
  backgroundColor: '#2D2D2D',
  borderRadius: '20px',
  minWidth: '120px',
  height: '40px',
  '.MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&:hover': {
    backgroundColor: '#3D3D3D',
  },
  '&.Mui-focused': {
    backgroundColor: '#3D3D3D',
  },
  '.MuiSelect-select': {
    paddingTop: '8px',
    paddingBottom: '8px',
  },
  '.MuiSvgIcon-root': {
    color: '#fff',
  },
}));
