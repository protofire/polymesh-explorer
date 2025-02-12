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
import { useLocalPagination } from '@/hooks/useLocalPagination';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';
import { truncateAddress } from '@/services/polymesh/address';

interface AssetTabTableProps {
  assets: Asset[];
}

export function AssetTabTable({ assets }: AssetTabTableProps) {
  const { paginatedItems: paginatedAssets, ...paginationController } =
    useLocalPagination(assets);

  return (
    <>
      <TableContainer component={Paper} sx={{ minHeight: '15rem' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Ticker or Id</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Fungible / Non fungible</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAssets.length > 0 ? (
              paginatedAssets.map((asset) => (
                <TableRow key={asset.assetId}>
                  <TableCell>
                    <GenericLink href={`${ROUTES.Asset}/${asset.assetId}`}>
                      {asset.name}
                    </GenericLink>
                  </TableCell>
                  <TableCell>
                    <GenericLink href={`${ROUTES.Asset}/${asset.assetId}`}>
                      {asset.ticker || truncateAddress(asset.assetId, 4)}
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
              <NoDataAvailableTBody colSpan={4} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter paginationController={paginationController} />
    </>
  );
}
