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
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';
import { PortfolioWithAssets } from '@/domain/entities/Portfolio';
import { useLocalPagination } from '@/hooks/useLocalPagination';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';
import { NftAvatarField } from '@/components/shared/common/NftAvatarField';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { ROUTES } from '@/config/routes';

interface TabNftAssetsProps {
  selectedPortfolio: PortfolioWithAssets | null;
  isLoadingNfts: boolean;
}

export function TabNftAssets({
  selectedPortfolio,
  isLoadingNfts,
}: TabNftAssetsProps) {
  const nftAssets = selectedPortfolio?.nonFungibleAssets?.nftAssets || [];
  const {
    paginatedItems: paginatedNftAssets,
    paginationInfo,
    ...paginationController
  } = useLocalPagination(nftAssets);

  if (isLoadingNfts) {
    return <GenericTableSkeleton columnCount={5} rowCount={3} />;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>NFT ID</TableCell>
              <TableCell>Collection Ticker</TableCell>
              <TableCell>Collection Name</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {nftAssets.length > 0 ? (
              paginatedNftAssets.map((asset) => (
                <TableRow key={`${asset.collectionTicker}-${asset.id}`}>
                  <TableCell>
                    <NftAvatarField
                      imgUrl={asset.imgUrl}
                      alt={asset.collectionName}
                    />
                  </TableCell>
                  <TableCell>{asset.id}</TableCell>
                  <TableCell>{asset.collectionTicker}</TableCell>
                  <TableCell>
                    <GenericLink
                      href={`${ROUTES.Asset}/${asset.collectionTicker}`}
                    >
                      {asset.collectionName}
                    </GenericLink>
                  </TableCell>
                  <TableCell>{asset.isLocked ? 'Locked' : 'Free'}</TableCell>
                </TableRow>
              ))
            ) : (
              <NoDataAvailableTBody
                colSpan={5}
                message="No NFT items available for this portfolio"
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter
        paginationController={{ paginationInfo, ...paginationController }}
      />
    </>
  );
}
