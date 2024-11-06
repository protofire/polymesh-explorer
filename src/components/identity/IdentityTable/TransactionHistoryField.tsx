import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { format } from 'date-fns';
import { EmptyDash } from '@/components/shared/common/EmptyDash';
import { ExtrinsicTransaction } from '@/domain/entities/ExtrinsicTransaction';

export function TransactionHistoryField({
  transaction,
}: {
  transaction: ExtrinsicTransaction | undefined;
}) {
  return transaction ? (
    <Tooltip title={format(transaction.block.datetime, 'PPpp')}>
      <Box display="flex" alignItems="center">
        <Typography variant="body2" noWrap>
          {transaction.moduleId}
        </Typography>
        {transaction.success ? (
          <CheckCircleIcon color="success" fontSize="small" sx={{ ml: 1 }} />
        ) : (
          <CancelIcon color="error" fontSize="small" sx={{ ml: 1 }} />
        )}
      </Box>
    </Tooltip>
  ) : (
    <EmptyDash />
  );
}
