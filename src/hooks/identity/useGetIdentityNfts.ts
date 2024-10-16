import { useQuery } from '@tanstack/react-query';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Identity } from '@/domain/entities/Identity';
import { customReportError } from '@/utils/customReportError';
import { NftService, NftCollection, NftAsset } from '@/services/NftService';

interface Props {
  identity?: Identity | null;
}

interface NftData {
  collections: NftCollection[];
  assets: NftAsset[];
}

export const useGetIdentityNfts = ({ identity }: Props) => {
  const { polymeshService } = usePolymeshSdkService();

  return useQuery<NftData | null, Error>({
    queryKey: ['useGetIdentityNfts', identity?.did],
    queryFn: async () => {
      if (!identity || !polymeshService) return null;

      try {
        const nftService = new NftService(polymeshService);
        const portfolios = await polymeshService.getIdentityPortfolios(identity.did);

        const collections = await Promise.all(
          portfolios.map(portfolio => nftService.getCollectionsFromPortfolio(portfolio as any))
        );
        const assets = await Promise.all(
          portfolios.map(portfolio => nftService.getNftAssetsFromPortfolio(portfolio as any))
        );

        return {
          collections: collections.flat(),
          assets: assets.flat(),
        };
      } catch (error) {
        customReportError(error);
        throw error;
      }
    },
    enabled: !!identity && !!polymeshService,
  });
};
