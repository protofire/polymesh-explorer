import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';
import { PaginatedData } from '@/domain/ui/PaginationInfo';
import {
  AssetHolder,
  isAssetNonFungibleHolder,
} from '@/domain/entities/AssetHolder';
import { Asset } from '@/domain/entities/Asset';

interface HoldersTabProps {
  assetHolders: PaginatedData<AssetHolder[]> | undefined;
  asset: Asset;
  isLoading: boolean;
}

export function HoldersTab({
  assetHolders,
  asset,
  isLoading,
}: HoldersTabProps) {
  if (isLoading || assetHolders === undefined) {
    return (
      <GenericTableSkeleton
        columnCount={asset.isNftCollection ? 4 : 3}
        rowCount={5}
      />
    );
  }

  const { data: holders, paginationController } = assetHolders;

  return (
    <Box p={2}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Identity</TableCell>
            {asset.isNftCollection ? (
              <>
                <TableCell align="right">NFT Ids</TableCell>
                <TableCell align="right">Total NFTs</TableCell>
                <TableCell align="right">Percentage</TableCell>
              </>
            ) : (
              <>
                <TableCell align="right">Balance</TableCell>
                <TableCell align="right">Percentage</TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {holders?.length ? (
            holders?.map((holder) => (
              <TableRow key={holder.identityDid}>
                <TableCell>
                  <AccountOrDidTextField
                    value={holder.identityDid}
                    isIdentity
                  />
                </TableCell>
                {isAssetNonFungibleHolder(holder) && (
                  <TableCell align="right">
                    {holder.nftIds.join(', ')}
                  </TableCell>
                )}
                <TableCell align="right">{holder.balance}</TableCell>
                <TableCell align="right">{holder.percentage}%</TableCell>
              </TableRow>
            ))
          ) : (
            <NoDataAvailableTBody colSpan={5} message="No holders available." />
          )}
        </TableBody>
      </Table>
      <PaginationFooter paginationController={paginationController} />
    </Box>
  );
}
