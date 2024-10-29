import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Identity } from '@/domain/entities/Identity';
import { customReportError } from '@/utils/customReportError';
import { PortfolioWithAssets } from '@/domain/entities/Portfolio';
import { Asset } from '@/domain/entities/Asset';

interface Props {
  identity?: Identity | null;
}

export const useGetIdentityPortfolios = ({ identity }: Props) => {
  const { polymeshService } = usePolymeshSdkService();

  const assetsMap = useMemo(() => {
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

  const queryResult = useQuery<PortfolioWithAssets[] | null, Error>({
    queryKey: ['useGetIdentityDetails', identity?.did],
    queryFn: async () => {
      if (!identity || !polymeshService) return null;

      try {
        const portfolios = await polymeshService.getIdentityPortfolios(
          identity.did,
        );

        return portfolios?.map((portfolio) => ({
          ...portfolio,
          assets: portfolio.assets.map((assetPortfolio) => {
            const assetInfo = assetsMap.get(assetPortfolio.assetId);
            return {
              ...assetPortfolio,
              name: assetInfo?.name,
              ticker: assetInfo?.ticker,
              type: assetInfo?.type,
            };
          }),
        }));
      } catch (error) {
        customReportError(error);
        throw error;
      }
    },
    enabled: !!identity && !!polymeshService,
  });

  return queryResult;
};
