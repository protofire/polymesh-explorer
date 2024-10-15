import React from 'react';
import { Typography, Tooltip } from '@mui/material';

interface FormattedNumberProps {
  value: number | string;
  decimals?: number;
}

function formatNumber(num: number | string, decimals: number = 2): string {
  if (typeof num === 'string') {
    const match = num.match(/^(\d+(\.\d+)?)([KMBT])?$/);
    if (match) {
      const [, numberPart, , suffix] = match;
      const formattedNumber = Number(numberPart).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
      });
      return `${formattedNumber}${suffix || ''}`;
    }
    return num; // Return as is if it doesn't match the expected format
  }

  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup.slice().reverse().find(function(item) {
    return num >= item.value;
  });
  return item
    ? (num / item.value).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
      }).replace(rx, '$1') + item.symbol
    : '0';
}

export function FormattedNumber({ value, decimals = 2 }: FormattedNumberProps) {
  const formattedValue = formatNumber(value, decimals);
  const fullValue = typeof value === 'number'
    ? value.toLocaleString(undefined, { maximumFractionDigits: decimals })
    : value;

  if (formattedValue === fullValue) {
    return <Typography>{formattedValue}</Typography>;
  }

  return (
    <Tooltip title={fullValue} arrow>
      <Typography>{formattedValue}</Typography>
    </Tooltip>
  );
}
