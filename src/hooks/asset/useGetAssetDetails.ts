import { useQuery } from '@tanstack/react-query';
import {
  Asset as AssetSdk,
  MetadataLockStatus,
} from '@polymeshassociation/polymesh-sdk/types';
import { NftCollection } from '@polymeshassociation/polymesh-sdk/internal';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Asset, AssetDetails } from '@/domain/entities/Asset';
import { customReportError } from '@/utils/customReportError';
import { splitCamelCase } from '@/utils/formatString';

export interface UseGetAssetDetailsReturn {
  assetDetails: AssetDetails | null;
  status: {
    isLoadingSdkClass: boolean;
    isLoadingDetails: boolean;
  };
  error: {
    sdkClassError: Error | null;
    detailsError: Error | null;
  };
}

export const useGetAssetDetails = (
  asset: Asset | null | undefined,
): UseGetAssetDetailsReturn => {
  const { polymeshService } = usePolymeshSdkService();

  const sdkClassQuery = useQuery({
    queryKey: ['useGetAssetSdkClass', asset?.assetId],
    queryFn: async () => {
      if (!polymeshService?.polymeshSdk || !asset?.assetId) {
        throw new Error('Polymesh SDK not initialized or invalid asset ID');
      }

      try {
        const assetSdk = await polymeshService.polymeshSdk.assets.getAsset({
          assetId: asset.assetId,
        });
        return assetSdk;
      } catch (error) {
        customReportError(error);
        throw error;
      }
    },
    enabled: !!polymeshService && !!asset?.assetId,
  });

  const assetSdk = sdkClassQuery.data as AssetSdk | undefined;

  const assetDetailsQuery = useQuery({
    queryKey: ['useGetAssetDetails', asset?.assetId],
    queryFn: async () => {
      if (!assetSdk) {
        throw new Error('Asset SDK not initialized');
      }
      try {
        const [
          collectionId,
          collectionKeys,
          fundingRound,
          assetIdentifiers,
          docs,
          meta,
          requiredMediators,
          venueFilteringDetails,
          assetIsFrozen,
        ] = await Promise.all([
          assetSdk instanceof NftCollection
            ? assetSdk.getCollectionId()
            : undefined,
          assetSdk instanceof NftCollection ? assetSdk.collectionKeys() : [],
          assetSdk.currentFundingRound(),
          assetSdk.getIdentifiers(),
          assetSdk.documents.get(),
          assetSdk.metadata.get(),
          assetSdk.getRequiredMediators(),
          assetSdk.getVenueFilteringDetails(),
          assetSdk.isFrozen(),
        ]);

        const metaData = (
          await Promise.all(
            meta.map(async (entry) => {
              const value = await entry.value();
              const metaDetails = await entry.details();

              let lockedUntil: Date | undefined;
              if (value?.lockStatus === MetadataLockStatus.LockedUntil) {
                lockedUntil = value?.lockedUntil;
              }
              return {
                name: splitCamelCase(metaDetails.name),
                description: metaDetails.specs.description,
                expiry: value?.expiry ? value?.expiry : null,
                lockedUntil,
                isLocked: value?.lockStatus
                  ? splitCamelCase(value?.lockStatus)
                  : null,
                value: value?.value || null,
              };
            }),
          )
        ).filter((entry) => entry.value !== null);

        return {
          assetIdentifiers,
          collectionId: collectionId?.toNumber(),
          collectionKeys,
          fundingRound,
          metaData,
          requiredMediators: requiredMediators.map((identity) => identity.did),
          venueFilteringEnabled: venueFilteringDetails.isEnabled,
          permittedVenuesIds: venueFilteringDetails.allowedVenues.map((venue) =>
            venue.id.toString(),
          ),
          isFrozen: assetIsFrozen,
          docs: docs.data,
        };
      } catch (error) {
        customReportError(error);
        throw error;
      }
    },
    enabled: !!assetSdk,
  });

  const assetDetails: AssetDetails | null = asset
    ? {
        ...asset,
        details: assetDetailsQuery.data || undefined,
      }
    : null;

  return {
    assetDetails,
    status: {
      isLoadingSdkClass: sdkClassQuery.isLoading,
      isLoadingDetails: assetDetailsQuery.isLoading,
    },
    error: {
      sdkClassError: sdkClassQuery.error as Error | null,
      detailsError: assetDetailsQuery.error as Error | null,
    },
  };
};
