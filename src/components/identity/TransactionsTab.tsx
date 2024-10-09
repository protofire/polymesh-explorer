import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Box,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Transaction } from '@/hooks/identity/useTransactionHistoryAccounts';
import { truncateAddress } from '@/services/polymesh/address';
import { PolymeshExplorerLink } from '../shared/ExplorerLink/PolymeshExplorerLink';

interface TransactionsTabProps {
  transactions: Transaction[];
  subscanUrl: string;
}

export function TransactionsTab({
  transactions,
  subscanUrl,
}: TransactionsTabProps) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Module</TableCell>
            <TableCell>Call</TableCell>
            <TableCell>Hash</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.extrinsicHash}>
              <TableCell>
                <Tooltip
                  title={new Date(transaction.block.datetime).toLocaleString()}
                >
                  <span>
                    {formatDistanceToNow(new Date(transaction.block.datetime), {
                      addSuffix: true,
                    })}
                  </span>
                </Tooltip>
              </TableCell>
              <TableCell>{transaction.moduleId}</TableCell>
              <TableCell>{transaction.callId}</TableCell>
              <TableCell>
                <>
                  {truncateAddress(transaction.extrinsicHash)}
                  <PolymeshExplorerLink
                    baseUrl={subscanUrl}
                    hash={transaction.extrinsicHash}
                  />
                </>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center">
                  {transaction.success ? (
                    <Tooltip title="Success">
                      <CheckCircleIcon color="success" fontSize="small" />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Failed">
                      <CancelIcon color="error" fontSize="small" />
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
