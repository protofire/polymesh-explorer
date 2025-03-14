import React from 'react';
import { Box, TableCell, TableRow, Typography } from '@mui/material';
import DataObjectIcon from '@mui/icons-material/DataObject';

interface NoDataAvailableProps {
  message?: string;
  colSpan: number;
}

export function NoDataAvailableTBody({
  colSpan,
  message = 'No data available',
}: NoDataAvailableProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} sx={{ border: 'none', height: '100%' }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="10rem"
          py="10%"
        >
          <DataObjectIcon
            sx={{ fontSize: '2rem', color: 'action.disabled', mb: '5%' }}
          />
          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
}
