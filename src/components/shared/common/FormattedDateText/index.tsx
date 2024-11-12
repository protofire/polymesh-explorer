import React from 'react';
import { Tooltip, Typography } from '@mui/material';
import { format, formatDistanceToNow, isValid } from 'date-fns';

interface FormattedDateProps {
  date: Date | string;
  formatString?: string;
  variant?: 'caption' | 'body1';
}

export function FormattedDate({
  date,
  formatString = 'PPpp',
  variant = 'caption',
}: FormattedDateProps) {
  const parsedDate = typeof date === 'string' ? new Date(`${date}Z`) : date;

  if (!isValid(parsedDate)) {
    return null;
  }

  return (
    <Tooltip title={format(parsedDate, formatString)}>
      <Typography variant={variant}>
        {formatDistanceToNow(parsedDate, { addSuffix: true })}
      </Typography>
    </Tooltip>
  );
}
