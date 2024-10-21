import React from 'react';
import { Chip, styled } from '@mui/material';
import { InstructionStatus } from '@polymeshassociation/polymesh-sdk/types';

interface StatusBadgeProps {
  status: InstructionStatus;
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
    case InstructionStatus.Pending:
      color = 'warning';
      break;
    case InstructionStatus.Success:
      color = 'success';
      break;
    case InstructionStatus.Failed:
    case InstructionStatus.Rejected:
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
