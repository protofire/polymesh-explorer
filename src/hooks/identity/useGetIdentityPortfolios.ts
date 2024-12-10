import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Identity } from '@/domain/entities/Identity';
import { customReportError } from '@/utils/customReportError';
import { PortfolioWithAssets } from '@/domain/entities/Portfolio';
import { Asset } from '@/domain/entities/Asset';
import { useGetAssetsByList } from '@/hooks/asset/useGetAssetsByList';
import { uuidToHex } from '@/services/polymesh/hexToUuid';

interface Props {
  identity?: Identity | null;
}

export const useGetIdentityPortfolios = ({ identity }: Props) => {
  const { polymeshService } = usePolymeshSdkService();

  const identityAssetsMap = useMemo(() => {
    if (!identity) return new Map<string, Asset>();

    const map = new Map<string, Asset>();

    [...(identity.heldAssets || []), ...(identity.ownedAssets || [])].forEach(
      (asset) => {
        if (!map.has(asset.assetId)) {
          map.set(asset.assetId, asset);
        }
      },
    );

    return map;
  }, [identity]);

  const portfoliosQuery = useQuery({
    queryKey: ['getIdentityPortfolios', identity?.did],
    queryFn: async () => {
      if (!identity || !polymeshService) return null;
      return polymeshService.getIdentityPortfolios(identity.did);
    },
    enabled: !!identity && !!polymeshService,
  });

  const additionalAssetIds = useMemo(() => {
    if (!identity || !portfoliosQuery.data) return [];

    const portfolioAssetIds = portfoliosQuery.data.flatMap((portfolio) =>
      portfolio.assets.map((asset) => uuidToHex(asset.assetId)),
    );

    return portfolioAssetIds.filter(
      (assetId) => !identityAssetsMap.has(assetId),
    );
  }, [identity, portfoliosQuery.data, identityAssetsMap]);

  const assetsQuery = useGetAssetsByList(additionalAssetIds);

  const assetsMap = useMemo(() => {
    const combinedMap = new Map(identityAssetsMap);

    if (assetsQuery.data) {
      Object.entries(assetsQuery.data).forEach(([assetId, asset]) => {
        if (!combinedMap.has(assetId)) {
          combinedMap.set(assetId, asset);
        }
      });
    }

    return combinedMap;
  }, [identityAssetsMap, assetsQuery.data]);

  const queryResult = useQuery<PortfolioWithAssets[] | null, Error>({
    queryKey: ['useGetIdentityDetails', identity?.did, assetsQuery.data],
    queryFn: async () => {
      if (
        !identity ||
        !polymeshService ||
        !portfoliosQuery.data ||
        (additionalAssetIds.length > 0 && !assetsQuery.data)
      )
        return null;

      try {
        return portfoliosQuery.data
          .map((portfolio) => ({
            ...portfolio,
            assets: portfolio.assets.map((assetPortfolio) => {
              const assetInfo = assetsMap.get(
                uuidToHex(assetPortfolio.assetId),
              );
              return {
                ...assetPortfolio,
                name: assetInfo?.name,
                ticker: assetInfo?.ticker,
                type: assetInfo?.type,
              };
            }),
          }))
          .sort((a, b) => {
            const isACurrentIdentity = a.id.startsWith(identity.did);
            const isBCurrentIdentity = b.id.startsWith(identity.did);

            if (isACurrentIdentity && !isBCurrentIdentity) return -1;
            if (!isACurrentIdentity && isBCurrentIdentity) return 1;

            return parseInt(a.number, 10) - parseInt(b.number, 10);
          });
      } catch (error) {
        customReportError(error);
        throw error;
      }
    },
    enabled:
      !!identity &&
      !!polymeshService &&
      !!portfoliosQuery.data &&
      (additionalAssetIds.length === 0 || !!assetsQuery.data) &&
      !assetsQuery.isLoading,
  });

  return queryResult;
};
