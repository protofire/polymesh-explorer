import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { BigNumber } from '@polymeshassociation/polymesh-sdk';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { customReportError } from '@/utils/customReportError';
import { validateAssetId } from '@/services/polymesh/validation/assetIdValidator';
import { getNftDetails } from '@/services/polymesh/sdk/assetsService';
import { NftAssetWithMetadata } from '@/domain/entities/NftData';

export function useGetNftById({
  assetId,
  nftId,
}: {
  assetId: string;
  nftId: string;
}): UseQueryResult<NftAssetWithMetadata | null, Error> {
  const { polymeshService } = usePolymeshSdkService();

  return useQuery<NftAssetWithMetadata | null, Error>({
    queryKey: ['useGetNft', assetId, nftId],
    queryFn: async () => {
      if (!polymeshService?.polymeshSdk) {
        throw new Error('SDK not initialized');
      }
      // Validate URL input params
      const { normalizedId, isValid } = validateAssetId(assetId);
      if (!isValid) {
        return null;
      }
      if (!Number(nftId)) return null;

      const { polymeshSdk } = polymeshService;
      try {
        const collectionSdk = await polymeshSdk.assets.getNftCollection({
          assetId: normalizedId as string,
        });
        if (!collectionSdk) {
          throw new Error('Asset is not an NFT collection');
        }

        const nftSdk = await collectionSdk.getNft({ id: new BigNumber(nftId) });
        if (!nftSdk) {
          throw new Error('NFT Id is not part of NFT collection');
        }

        const collectionKeys = (await collectionSdk.collectionKeys()) || [];
        const ownerPortfolio = await nftSdk.getOwner();

        let ownerData;
        if (ownerPortfolio) {
          const ownerPortfolioId =
            'id' in ownerPortfolio ? ownerPortfolio.id.toString() : 'default';

          ownerData = {
            ownerDid: ownerPortfolio.owner.did.toString(),
            ownerPortfolioId,
          };
        }
        const isLocked = await nftSdk.isLocked();

        const nftDetails = await getNftDetails(
          nftSdk,
          isLocked,
          collectionKeys,
          ownerData?.ownerDid || '',
          ownerData?.ownerPortfolioId || '',
        );

        return nftDetails;
      } catch (e) {
        customReportError(e);
        throw e;
      }
    },
    enabled: !!polymeshService?.polymeshSdk && !!assetId && !!nftId,
  });
}
