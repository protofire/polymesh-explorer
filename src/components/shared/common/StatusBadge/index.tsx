import React from 'react';
import { Chip, styled } from '@mui/material';

export interface StatusBadgeProps {
  status:
    | 'created'
    | 'executed'
    | 'rejected'
    | 'failed'
    | 'affirmed'
    | 'pending';
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
  '&.MuiChip-filledInfo': {
    backgroundColor: theme.palette.info.light,
    color: theme.palette.info.contrastText,
  },
}));

export function StatusBadge({ status }: StatusBadgeProps) {
  let color: 'success' | 'error' | 'warning' | 'info' | 'default' = 'default';

  switch (status) {
    case 'created':
      color = 'info';
      break;
    case 'pending':
      color = 'warning';
      break;
    case 'executed':
    case 'affirmed':
      color = 'success';
      break;
    case 'rejected':
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
