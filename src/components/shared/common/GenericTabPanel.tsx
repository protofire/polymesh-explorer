import React from 'react';
import { Box } from '@mui/material';

interface GenericTabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  labelKey: string;
}

export function GenericTabPanel(props: GenericTabPanelProps) {
  const { children, value, index, labelKey, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`${labelKey}-tabpanel-${index}`}
      aria-labelledby={`${labelKey}-tab-${index}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Box>
  );
}
