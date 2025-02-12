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
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { ROUTES } from '@/config/routes';
import { FormattedNumber } from '@/components/shared/fieldAttributes/FormattedNumber';
import { AssetPortfolio } from '@/domain/entities/Portfolio';
import { useLocalPagination } from '@/hooks/useLocalPagination';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';
import { truncateAddress } from '@/services/polymesh/address';

interface TabPortfolioAssetsProps {
  assets: AssetPortfolio[];
}

export function TabPortfolioAssets({ assets }: TabPortfolioAssetsProps) {
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
              <TableCell>Balance</TableCell>
              <TableCell>Asset Type</TableCell>
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
                  <TableCell>
                    <FormattedNumber value={asset.balance} />
                  </TableCell>
                  <TableCell>{asset.type}</TableCell>
                </TableRow>
              ))
            ) : (
              <NoDataAvailableTBody
                colSpan={4}
                message="No assets available for this portfolio"
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter paginationController={paginationController} />
    </>
  );
}
