import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import Link from 'next/link';
import { Asset } from '@/domain/entities/Asset';
import { ROUTES } from '@/config/routes';
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';

interface AssetTabTableProps {
  assets: Asset[];
}

export function AssetTabTable({ assets }: AssetTabTableProps) {
  return (
    <TableContainer component={Paper} sx={{ minHeight: '15rem' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Ticker</TableCell>
            <TableCell>Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.length > 0 ? (
            assets.map((asset) => (
              <TableRow key={asset.ticker}>
                <TableCell>{asset.name}</TableCell>
                <TableCell>
                  <Link href={`${ROUTES.Asset}/${asset.ticker}`}>
                    {asset.ticker}
                  </Link>
                </TableCell>
                <TableCell>{asset.type}</TableCell>
              </TableRow>
            ))
          ) : (
            <NoDataAvailableTBody colSpan={3} />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
