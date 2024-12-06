import React from 'react';
import { Chip, styled } from '@mui/material';

export interface StatusBadgeProps {
  status: 'affirmed' | 'pending' | 'failed';
}

const StyledChip = styled(Chip)(({ theme }) => ({
  fontWeight: 'bold',
  '&.MuiChip-filledSuccess': {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.contrastText,
  },
  '&.MuiChip-filledError': {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
  },
  '&.MuiChip-filledWarning': {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.contrastText,
  },
}));

export function StatusBadge({ status }: StatusBadgeProps) {
  let color: 'success' | 'error' | 'warning' | 'default' = 'default';

  switch (status) {
    case 'pending':
      color = 'warning';
      break;
    case 'affirmed':
      color = 'success';
      break;
    case 'failed':
      color = 'error';
      break;
    default:
      color = 'default';
      break;
  }

  return (
    <StyledChip label={status} color={color} variant="filled" size="small" />
  );
}
