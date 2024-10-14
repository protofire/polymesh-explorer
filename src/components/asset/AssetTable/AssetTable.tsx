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
  TablePagination,
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
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';

interface AssetTableProps {
  paginatedAssets: PaginatedData<Asset[]>;
  isLoading: boolean;
  error: Error | null;
}

const MAX_NAME_LENGTH = 20;

export function AssetTable({
  paginatedAssets,
  isLoading,
  error,
}: AssetTableProps) {
  if (isLoading) return <GenericTableSkeleton columnCount={8} rowCount={10} />;
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

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

  const handlePageChange = (event: unknown, newPage: number) => {
    goToPage(newPage + 1);
    if (newPage === 0) {
      onFirstPage();
    } else {
      onNextPage();
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    changePageSize(parseInt(event.target.value, 10));
    onFirstPage();
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
            {paginatedAssets.length > 0 ? (
              paginatedAssets.map((asset) => (
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
      <TablePagination
        component="div"
        count={paginationInfo.totalCount}
        page={paginationInfo.currentPage - 1}
        onPageChange={handlePageChange}
        rowsPerPage={paginationInfo.pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 30, 50]}
      />
    </Box>
  );
}
