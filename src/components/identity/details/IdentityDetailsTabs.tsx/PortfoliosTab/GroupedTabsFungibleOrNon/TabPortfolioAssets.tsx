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
              <TableCell>Ticker</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Asset Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAssets.length > 0 ? (
              paginatedAssets.map((asset) => (
                <TableRow key={asset.ticker}>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>
                    <GenericLink href={`${ROUTES.Asset}/${asset.ticker}`}>
                      {asset.ticker}
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
