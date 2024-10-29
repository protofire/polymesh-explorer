import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Asset } from '@/domain/entities/Asset';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';

interface HoldersTabProps {
  asset: Asset;
}

export function HoldersTab({ asset }: HoldersTabProps) {
  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Asset Holders
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Identity</TableCell>
            <TableCell align="right">Balance</TableCell>
            <TableCell align="right">Percentage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {asset.holders?.map((holder) => (
            <TableRow key={holder.did}>
              <TableCell>
                <AccountOrDidTextField value={holder.did} isIdentity />
              </TableCell>
              <TableCell align="right">{holder.balance}</TableCell>
              <TableCell align="right">{holder.percentage}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
} 