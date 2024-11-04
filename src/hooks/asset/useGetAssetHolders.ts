import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Asset as AssetSdk } from '@polymeshassociation/polymesh-sdk/types';
import { BigNumber } from '@polymeshassociation/polymesh-sdk';
import { useCallback, useMemo } from 'react';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { customReportError } from '@/utils/customReportError';
import { usePaginationControllerGraphQl } from '../usePaginationControllerGraphQl';
import { Asset } from '@/domain/entities/Asset';
import { AssetHoldersGraphRepo } from '@/services/repositories/AssetHoldersGraphRepo';
import { PaginatedData } from '@/domain/ui/PaginationInfo';
import {
  AssetHolder,
  isAssetNonFungibleHolder,
} from '@/domain/entities/AssetHolder';

interface Props {
  asset: Asset;
}

export interface UseGetAssetHoldersReturn
  extends PaginatedData<AssetHolder[]> {}

export function useGetAssetHolders({
  asset,
}: Props): UseQueryResult<UseGetAssetHoldersReturn> {
  const { graphQlClient } = usePolymeshSdkService();
  const paginationController = usePaginationControllerGraphQl();
  const assetHoldersService = useMemo(() => {
    if (!graphQlClient) return null;
    return new AssetHoldersGraphRepo(graphQlClient);
  }, [graphQlClient]);

  const fetchAssetHolders = useCallback(async () => {
    if (!assetHoldersService) {
      throw new Error('AssetHolderService is not initialized');
    }

    try {
      const totalSupply = new BigNumber(asset.totalSupply);
      let result;

      if (asset.isNftCollection) {
        result = await assetHoldersService.getNftHolders(
          asset.assetId,
          paginationController.paginationInfo.pageSize,
          paginationController.paginationInfo.cursor || undefined,
        );
      } else {
        result = await assetHoldersService.getAssetHolders(
          asset.assetId,
          paginationController.paginationInfo.pageSize,
          paginationController.paginationInfo.cursor || undefined,
        );
      }

      paginationController.setPageInfo({
        hasNextPage: result.pageInfo.hasNextPage,
        hasPreviousPage: result.pageInfo.hasPreviousPage,
        startCursor: result.pageInfo.startCursor,
        endCursor: result.pageInfo.endCursor,
        totalCount: result.totalCount,
      });

      const holders = result.holders.map((h) => {
        const balance = new BigNumber(h.balance);
        const percentage = totalSupply.isZero()
          ? '0'
          : balance.div(totalSupply).multipliedBy(100).toFixed(2);

        return isAssetNonFungibleHolder(h)
          ? {
              identityDid: h.identityDid,
              balance: balance.toString(),
              nftIds: h.nftIds,
              percentage,
            }
          : {
              identityDid: h.identityDid,
              balance: balance.toString(),
              percentage,
            };
      });

      return holders;
    } catch (error) {
      customReportError(error);
      throw error;
    }
  }, [
    assetHoldersService,
    asset.totalSupply,
    asset.isNftCollection,
    asset.assetId,
    paginationController,
  ]);

  return useQuery<AssetHolder[], Error, UseGetAssetHoldersReturn>({
    queryKey: [
      'useGetAssetHolders',
      asset.assetId,
      paginationController.paginationInfo.pageSize,
      paginationController.paginationInfo.cursor,
    ],
    queryFn: fetchAssetHolders,
    select: useCallback(
      (data: AssetHolder[]) => ({
        data,
        paginationController,
      }),
      [paginationController],
    ),
    enabled: !!graphQlClient && !!assetHoldersService,
  });
}
