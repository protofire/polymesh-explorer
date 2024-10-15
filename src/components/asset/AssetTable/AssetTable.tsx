'use client';

import React from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
} from '@mui/material';
import Link from 'next/link';
import CollectionsIcon from '@mui/icons-material/Collections';
import TokenIcon from '@mui/icons-material/Toll';
import { truncateAddress } from '@/services/polymesh/address';
import { ROUTES } from '@/config/routes';
import { Asset } from '@/domain/entities/Asset';
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { FormattedDate } from '@/components/shared/common/FormattedDateText';
import { PaginatedData } from '@/domain/ui/PaginationInfo';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { FormattedNumber } from '@/components/shared/fieldAttributes/FormattedNumber';
import { TruncatedText } from '@/components/shared/fieldAttributes/TruncatedText';

interface AssetTableProps {
  paginatedAssets: PaginatedData<Asset[]>;
  error: Error | null;
}

export function AssetTable({ paginatedAssets, error }: AssetTableProps) {
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  const { paginationController, data: assets } = paginatedAssets;

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Ticker</TableCell>
              <TableCell style={{ width: '200px' }}>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Token Type</TableCell>
              <TableCell>Total Supply</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Documents</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.length > 0 ? (
              assets.map((asset) => (
                <TableRow key={asset.ticker}>
                  <TableCell>
                    <GenericLink href={`${ROUTES.Asset}/${asset.ticker}`}>
                      {asset.ticker}
                    </GenericLink>
                  </TableCell>
                  <TableCell>
                    <TruncatedText
                      text={asset.name}
                      maxLines={2}
                      lineHeight={1.2}
                      maxWidth="100%"
                    />
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
                  <TableCell>
                    <FormattedNumber value={parseFloat(asset.totalSupply)} />
                  </TableCell>
                  <TableCell>
                    <GenericLink
                      href={`${ROUTES.Identity}/${asset.ownerDid}`}
                      tooltipText="Go to Identity"
                    >
                      {truncateAddress(asset.ownerDid, 5)}
                    </GenericLink>
                  </TableCell>
                  <TableCell>{asset.documents}</TableCell>
                  <TableCell>
                    <FormattedDate date={asset.createdAt} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <NoDataAvailableTBody colSpan={8} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter paginationController={paginationController} />
    </Box>
  );
}
