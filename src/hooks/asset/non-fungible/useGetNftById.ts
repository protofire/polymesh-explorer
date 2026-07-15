import { BigNumber } from '@polymeshassociation/polymesh-sdk';
import { AssetHolder } from '@polymeshassociation/polymesh-sdk/types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { NftAssetWithMetadata } from '@/domain/entities/NftData';
import { getNftDetails } from '@/services/polymesh/sdk/assetsService';
import { validateAssetId } from '@/services/polymesh/validation/assetIdValidator';
import { customReportError } from '@/utils/customReportError';

async function resolveNftOwner(holder: AssetHolder): Promise<{
  ownerDid: string;
  ownerPortfolioId?: string;
  ownerAccount?: string;
}> {
  if ('owner' in holder) {
    const portfolioHuman = holder.toHuman();

    return {
      ownerDid: holder.owner.did,
      ownerPortfolioId: portfolioHuman.id ?? 'default',
    };
  }

  const identity = await holder.getIdentity();

  return {
    ownerDid: identity?.did ?? '',
    ownerAccount: holder.address,
  };
}

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
        const ownerHolder = await nftSdk.getOwner();
        const ownerData = ownerHolder
          ? await resolveNftOwner(ownerHolder)
          : undefined;
        const isLocked = await nftSdk.isLocked();

        const nftDetails = await getNftDetails(
          nftSdk,
          isLocked,
          collectionKeys,
          ownerData?.ownerDid || '',
          ownerData?.ownerPortfolioId || '',
          ownerData?.ownerAccount || '',
        );

        return {
          ...nftDetails,
          id: nftSdk.id.toNumber(),
        };
      } catch (e) {
        customReportError(e);
        throw e;
      }
    },
    enabled: !!polymeshService?.polymeshSdk && !!assetId && !!nftId,
  });
}
