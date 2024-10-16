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
} from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';
import TokenIcon from '@mui/icons-material/Toll';
import { Asset } from '@/domain/entities/Asset';
import { ROUTES } from '@/config/routes';
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { GenericLink } from '@/components/shared/common/GenericLink';

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
            <TableCell>Fungible / Non fungible</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.length > 0 ? (
            assets.map((asset) => (
              <TableRow key={asset.ticker}>
                <TableCell>{asset.name}</TableCell>
                <TableCell>
                  <GenericLink href={`${ROUTES.Asset}/${asset.ticker}`}>
                    {asset.ticker}
                  </GenericLink>
                </TableCell>
                <TableCell>{asset.type}</TableCell>
                <TableCell>
                  <Tooltip
                    title={
                      asset.isNftCollection
                        ? 'NFT Collection'
                        : 'Fungible Token'
                    }
                  >
                    {asset.isNftCollection ? (
                      <CollectionsIcon color="primary" />
                    ) : (
                      <TokenIcon color="secondary" />
                    )}
                  </Tooltip>
                </TableCell>
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
