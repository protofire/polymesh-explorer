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
import { GenericLink } from '@/components/shared/common/GenericLink';
import { ROUTES } from '@/config/routes';
import { NftAvatarField } from '@/components/shared/common/NftAvatarField';
import { PortfolioWithAssets } from '@/domain/entities/Portfolio';
import { useLocalPagination } from '@/hooks/useLocalPagination';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';

interface TabNftCollectionsProps {
  selectedPortfolio: PortfolioWithAssets | null;
  isLoadingCollections: boolean;
}

export function TabNftCollections({
  selectedPortfolio,
  isLoadingCollections,
}: TabNftCollectionsProps) {
  const collections = selectedPortfolio?.nonFungibleAssets?.collections || [];
  const {
    paginatedItems: paginatedCollections,
    paginationInfo,
    ...paginationController
  } = useLocalPagination(collections);

  if (isLoadingCollections) {
    return <GenericTableSkeleton columnCount={5} rowCount={3} />;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Collection ID</TableCell>
              <TableCell>Collection ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Asset Type</TableCell>
              <TableCell>Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {collections.length > 0 ? (
              paginatedCollections.map((collection) => (
                <TableRow key={collection.uuid}>
                  <TableCell>
                    <NftAvatarField
                      imgUrl={collection.imgUrl}
                      alt={collection.name}
                    />
                  </TableCell>
                  <TableCell>{collection.collectionId}</TableCell>
                  <TableCell>
                    <GenericLink href={`${ROUTES.Asset}/${collection.ticker}`}>
                      {collection.name}
                    </GenericLink>
                  </TableCell>
                  <TableCell>{collection.assetType}</TableCell>
                  <TableCell>{collection.count}</TableCell>
                </TableRow>
              ))
            ) : (
              <NoDataAvailableTBody
                colSpan={5}
                message="No NFT collections available for this portfolio"
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
