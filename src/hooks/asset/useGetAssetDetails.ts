import { useQueries } from '@tanstack/react-query';
import {
  TrustedClaimIssuer,
  ComplianceRequirements,
} from '@polymeshassociation/polymesh-sdk/types';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Asset, AssetDetails } from '@/domain/entities/Asset';
import { customReportError } from '@/utils/customReportError';

// ComplianceRequirements to Requirement[]
const transformRequirements = (complianceReqs: ComplianceRequirements) => {
  return Object.values(complianceReqs).flat();
};

export interface UseGetAssetDetailsReturn {
  assetDetails: AssetDetails | null;
  status: {
    isLoadingMetadata: boolean;
    isLoadingCompliance: boolean;
    isLoadingTrustedIssuers: boolean;
    isFetchedMetadata: boolean;
    isFetchedCompliance: boolean;
    isFetchedTrustedIssuers: boolean;
  };
  error: {
    metadataError: Error | null;
    complianceError: Error | null;
    trustedIssuersError: Error | null;
  };
}

export const useGetAssetDetails = (
  asset: Asset | null | undefined,
): UseGetAssetDetailsReturn => {
  const { polymeshService } = usePolymeshSdkService();

  const queries = useQueries({
    queries: [
      {
        queryKey: ['useGetAssetDetailsMetadata', asset?.assetId],
        queryFn: async () => {
          if (!polymeshService?.polymeshSdk || !asset?.polymeshSdkClass) {
            throw new Error('Polymesh SDK or Asset SDK not initialized');
          }
          try {
            const metadata = await asset.polymeshSdkClass.metadata.get();
            return metadata;
          } catch (error) {
            customReportError(error);
            throw error;
          }
        },
        enabled: !!polymeshService && !!asset && !!asset.polymeshSdkClass,
      },
      {
        queryKey: ['useGetAssetDetailsCompliance', asset?.assetId],
        queryFn: async () => {
          if (!polymeshService?.polymeshSdk || !asset?.polymeshSdkClass) {
            throw new Error('Polymesh SDK or Asset SDK not initialized');
          }
          try {
            const [requirements, transfersAreFrozen] = await Promise.all([
              asset.polymeshSdkClass.compliance.requirements.get(),
              asset.polymeshSdkClass.compliance.requirements.arePaused(),
            ]);
            return {
              requirements: transformRequirements(requirements),
              transfersAreFrozen,
            };
          } catch (error) {
            customReportError(error);
            throw error;
          }
        },
        enabled: !!polymeshService && !!asset && !!asset.polymeshSdkClass,
      },
      {
        queryKey: ['useGetAssetDetailsTrustedIssuers', asset?.assetId],
        queryFn: async () => {
          if (!polymeshService?.polymeshSdk || !asset?.polymeshSdkClass) {
            throw new Error('Polymesh SDK or Asset SDK not initialized');
          }
          try {
            const trustedIssuers: TrustedClaimIssuer<true>[] =
              await asset.polymeshSdkClass.compliance.trustedClaimIssuers.get();
            return trustedIssuers;
          } catch (error) {
            customReportError(error);
            throw error;
          }
        },
        enabled: !!polymeshService && !!asset && !!asset.polymeshSdkClass,
      },
    ],
  });

  const [metadataQuery, complianceQuery, trustedIssuersQuery] = queries;

  const assetDetails: AssetDetails | null = asset
    ? {
        ...asset,
        metadata: metadataQuery.data || null,
        compliance: complianceQuery.data
          ? {
              requirements: complianceQuery.data.requirements,
              transfersAreFrozen: complianceQuery.data.transfersAreFrozen,
            }
          : null,
        trustedClaimIssuers: trustedIssuersQuery.data || null,
      }
    : null;

  return {
    assetDetails,
    status: {
      isLoadingMetadata: metadataQuery.isLoading,
      isLoadingCompliance: complianceQuery.isLoading,
      isLoadingTrustedIssuers: trustedIssuersQuery.isLoading,
      isFetchedMetadata: metadataQuery.isFetched,
      isFetchedCompliance: complianceQuery.isFetched,
      isFetchedTrustedIssuers: trustedIssuersQuery.isFetched,
    },
    error: {
      metadataError: metadataQuery.error as Error | null,
      complianceError: complianceQuery.error as Error | null,
      trustedIssuersError: trustedIssuersQuery.error as Error | null,
    },
  };
};
