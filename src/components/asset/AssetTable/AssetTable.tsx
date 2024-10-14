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

interface AssetTableProps {
  paginatedAssets: PaginatedData<Asset[]>;
  error: Error | null;
}

const MAX_NAME_LENGTH = 20;

export function AssetTable({ paginatedAssets, error }: AssetTableProps) {
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  const { paginationController, data: assets } = paginatedAssets;

  const renderAssetName = (name: string) => {
    if (name.length <= MAX_NAME_LENGTH) {
      return <Typography>{name}</Typography>;
    }

    return (
      <Tooltip title={name} arrow>
        <Typography
          noWrap
          style={{
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {name}
        </Typography>
      </Tooltip>
    );
  };

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
                    <Link href={`${ROUTES.Asset}/${asset.ticker}`}>
                      {asset.ticker}
                    </Link>
                  </TableCell>
                  <TableCell>{renderAssetName(asset.name)}</TableCell>
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
                  <TableCell>{asset.totalSupply}</TableCell>
                  <TableCell>
                    <Link href={`${ROUTES.Identity}/${asset.ownerDid}`}>
                      {truncateAddress(asset.ownerDid)}
                    </Link>
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
