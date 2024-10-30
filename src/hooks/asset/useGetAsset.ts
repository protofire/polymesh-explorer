import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import { AssetGraphRepo } from '@/services/repositories/AssetGraphRepo';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Asset } from '@/domain/entities/Asset';
import { customReportError } from '@/utils/customReportError';
import { validateAssetId } from '@/services/polymesh/validation/assetIdValidator';

export function useGetAsset({
  assetId,
}: {
  assetId: string;
}): UseQueryResult<Asset | null, Error> {
  const { graphQlClient } = usePolymeshSdkService();

  const assetService = useMemo(() => {
    if (!graphQlClient) return null;
    return new AssetGraphRepo(graphQlClient);
  }, [graphQlClient]);

  const validation = useMemo(() => validateAssetId(assetId), [assetId]);

  return useQuery<Asset | null, Error>({
    queryKey: ['useGetAsset', assetService, assetId],
    queryFn: async () => {
      if (!assetService) {
        throw new Error('Asset service not initialized');
      }

      if (!validation.isValid) {
        customReportError(validation.error);
        return null;
      }

      try {
        const assetNode = await assetService.findByAssetId(assetId);
        return assetNode;
      } catch (e) {
        customReportError(e);
        throw e;
      }
    },
    retry: (failureCount, error) => {
      // Don't retry validation errors
      if (error instanceof Error && error.message === validation.error) {
        return false;
      }
      return failureCount < 3;
    },
    enabled: !!assetService && validation.isValid !== undefined,
  });
}
