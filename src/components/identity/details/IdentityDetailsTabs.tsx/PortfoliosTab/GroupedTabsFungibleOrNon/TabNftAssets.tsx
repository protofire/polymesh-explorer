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
import { GenericLink } from '@/components/shared/common/GenericLink';
import { ROUTES } from '@/config/routes';
import { NftAvatarField } from '@/components/shared/common/NftAvatarField';

interface TabNftAssetsProps {
  selectedPortfolio: PortfolioWithAssets | null;
  isLoadingNfts: boolean;
}

export function TabNftAssets({
  selectedPortfolio,
  isLoadingNfts,
}: TabNftAssetsProps) {
  const nftAssets = selectedPortfolio?.nonFungibleAssets?.nftAssets;

  if (isLoadingNfts) {
    return <GenericTableSkeleton columnCount={5} rowCount={3} />;
  }

  if (!nftAssets || nftAssets.length === 0) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <NoDataAvailableTBody
              colSpan={5}
              message="No NFT assets available for this portfolio"
            />
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>NFT Image</TableCell>
            <TableCell>NFT ID</TableCell>
            <TableCell>Collection Ticker</TableCell>
            <TableCell>Collection Name</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {nftAssets.map((asset) => (
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
                <GenericLink href={`${ROUTES.Asset}/${asset.collectionTicker}`}>
                  {asset.collectionName}
                </GenericLink>
              </TableCell>
              <TableCell>{asset.isLocked ? 'Locked' : 'Free'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
