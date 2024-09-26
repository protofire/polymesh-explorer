import { styled } from '@mui/material/styles';
import { Autocomplete, TextField } from '@mui/material';

export const StyledTextField = styled(TextField)(() => ({
  backgroundColor: '#2a2a2a',
  borderRadius: '4px',
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
      borderColor: '#555',
    },
    '&:hover fieldset': {
      borderColor: '#888',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#fff',
    },
  },
}));

export const StyledAutocomplete = styled(Autocomplete)(() => ({
  '& .MuiAutocomplete-paper': {
    backgroundColor: '#2a2a2a',
    color: '#fff',
  },
  '& .MuiAutocomplete-option': {
    '&:hover': {
      backgroundColor: '#3a3a3a',
    },
  },
}));
