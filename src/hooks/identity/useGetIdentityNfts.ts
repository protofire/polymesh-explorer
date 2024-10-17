import { useQueries, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { PortfolioWithAssets } from '@/domain/entities/Portfolio';
import {
  getCollectionsFromPortfolio,
  getNftAssetsFromPortfolio,
} from '@/services/polymesh/sdk/assetsService';
import { customReportError } from '@/utils/customReportError';
import { NftData } from '@/domain/entities/NftData';

interface UseGetIdentityNftsProps {
  portfolios: PortfolioWithAssets[];
  selectedPortfolio: PortfolioWithAssets | null;
}

interface UseGetIdentityNftsReturn {
  portfolios: PortfolioWithAssets[];
  selectedPortfolio: PortfolioWithAssets | null;
  status: {
    isLoadingCollections: boolean;
    isLoadingNfts: boolean;
    isFetchedCollections: boolean;
    isFetchedNfts: boolean;
  };
  error: Error | null;
}

export const useGetIdentityNfts = ({
  portfolios,
  selectedPortfolio,
}: UseGetIdentityNftsProps): UseGetIdentityNftsReturn => {
  const { polymeshService } = usePolymeshSdkService();

  const collectionsQueries = useQueries({
    queries: portfolios.map((portfolio) => ({
      queryKey: ['useGetIdentityNftsCollections', portfolio.id],
      queryFn: async () => {
        if (!polymeshService?.polymeshSdk) {
          throw new Error('Polymesh SDK is not initialized');
        }
        try {
          return await getCollectionsFromPortfolio(portfolio.portfolioSdk);
        } catch (error) {
          customReportError(error);
          throw error;
        }
      },
      enabled: !!polymeshService,
    })),
  });

  const nftAssetsQuery = useQuery({
    queryKey: ['useGetIdentityNftsAssets', selectedPortfolio?.id],
    queryFn: async () => {
      if (!polymeshService?.polymeshSdk || !selectedPortfolio) {
        throw new Error(
          'Polymesh SDK is not initialized or no portfolio selected',
        );
      }
      try {
        return await getNftAssetsFromPortfolio(selectedPortfolio.portfolioSdk);
      } catch (error) {
        customReportError(error);
        throw error;
      }
    },
    enabled: !!selectedPortfolio && !!polymeshService,
  });

  const updatedPortfolios = useMemo(() => {
    return portfolios.map((portfolio, index) => ({
      ...portfolio,
      nonFungibleAssets: {
        collections: collectionsQueries[index].data || [],
        nftAssets:
          portfolio.id === selectedPortfolio?.id
            ? nftAssetsQuery.data || []
            : [],
      } as NftData,
    }));
  }, [portfolios, collectionsQueries, nftAssetsQuery.data, selectedPortfolio]);

  const updatedSelectedPortfolio = useMemo(() => {
    if (!selectedPortfolio) return null;
    return updatedPortfolios.find((p) => p.id === selectedPortfolio.id) || null;
  }, [selectedPortfolio, updatedPortfolios]);

  const status = {
    isLoadingCollections: collectionsQueries.some((query) => query.isLoading),
    isLoadingNfts: nftAssetsQuery.isLoading,
    isFetchedCollections: collectionsQueries.every((query) => query.isFetched),
    isFetchedNfts: nftAssetsQuery.isFetched,
  };

  const error =
    collectionsQueries.find((query) => query.error)?.error ||
    nftAssetsQuery.error ||
    null;

  return {
    portfolios: updatedPortfolios,
    selectedPortfolio: updatedSelectedPortfolio,
    status,
    error,
  };
};
