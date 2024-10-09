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

interface AssetTableProps {
  assets: Asset[];
}

export function AssetTable({ assets }: AssetTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Ticker</TableCell>
            <TableCell>Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.ticker}>
              <TableCell>{asset.name}</TableCell>
              <TableCell>
                <Link href={`${ROUTES.Asset}/${asset.ticker}`}>
                  {asset.ticker}
                </Link>
              </TableCell>
              <TableCell>{asset.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}