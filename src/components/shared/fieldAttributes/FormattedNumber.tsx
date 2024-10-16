import React from 'react';
import { Typography, Tooltip } from '@mui/material';
import { BigNumber } from '@polymeshassociation/polymesh-sdk';

interface FormattedNumberProps {
  value: number | string | BigNumber;
  decimals?: number;
}

function formatNumber(
  num: number | string | BigNumber,
  decimals: number = 2,
): string {
  const bigNum = BigNumber.isBigNumber(num)
    ? num
    : new BigNumber(num.toString());

  const lookup = [
    { value: new BigNumber(1), symbol: '' },
    { value: new BigNumber(1e3), symbol: 'K' },
    { value: new BigNumber(1e6), symbol: 'M' },
    { value: new BigNumber(1e9), symbol: 'B' },
    { value: new BigNumber(1e12), symbol: 'T' },
  ];

  const threshold = lookup
    .slice()
    .reverse()
    .find((t) => bigNum.gte(t.value));

  if (threshold) {
    const scaled = bigNum.div(threshold.value).toNumber();
    return (
      scaled.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
      }) + threshold.symbol
    );
  }

  return '0';
}

export function FormattedNumber({ value, decimals = 2 }: FormattedNumberProps) {
  const bigValue = BigNumber.isBigNumber(value)
    ? value
    : new BigNumber(value.toString());
  const formattedValue = formatNumber(bigValue, decimals);
  const fullValue = bigValue.isInteger()
    ? bigValue.toFormat(0)
    : bigValue.toFormat(decimals);

  if (formattedValue === fullValue) {
    return <Typography>{formattedValue}</Typography>;
  }

  return (
    <Tooltip title={fullValue} arrow>
      <Typography variant="body2">{formattedValue}</Typography>
    </Tooltip>
  );
}
