import { styled } from '@mui/material/styles';
import { Autocomplete, TextField, TextFieldProps } from '@mui/material';

export const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'customBigHeight',
})<TextFieldProps & { customBigHeight?: boolean }>(({
  theme,
  customBigHeight,
}) => {
  return {
    backgroundColor: '#0705063d',
    backdropFilter: 'blur(3px)',
    borderRadius: '4px',
    width: '50vw',
    [theme.breakpoints.down('lg')]: {
      width: '60vw',
    },
    [theme.breakpoints.down('md')]: {
      width: '80vw',
    },
    [theme.breakpoints.down('sm')]: {
      width: '90vw',
    },
    input: {
      color: '#fff',
    },
    '& label': {
      color: '#ccc',
    },
    '& label.Mui-focused': {
      color: '#fff',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.primary.main,
        height: customBigHeight ? '56px' : '48px',
        top: customBigHeight ? '-3px' : '0',
      },
      '&:hover fieldset': {
        borderColor: '#888',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#fff',
      },
    },
  };
});

export const StyledAutocomplete = styled(Autocomplete)(() => ({
  '& .MuiAutocomplete-paper': {
    backgroundColor: '#2a2a2a',
    color: '#fff',
  },
  '& .MuiAutocomplete-option': {
    padding: 0,
    '&[aria-selected="true"]': {
      backgroundColor: '#4a4a4a',
    },
    '&[aria-selected="true"].Mui-focused': {
      backgroundColor: '#5a5a5a',
    },
    '&:hover': {
      backgroundColor: '#3a3a3a',
    },
  },
  '& .MuiAutocomplete-listbox': {
    padding: '8px',
  },
}));
