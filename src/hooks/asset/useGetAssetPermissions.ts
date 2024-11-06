import { useQuery } from '@tanstack/react-query';
import { Asset as AssetSdk } from '@polymeshassociation/polymesh-sdk/types';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Asset } from '@/domain/entities/Asset';
import { agentWithGroupToAssetPermissions } from '@/services/transformers/assetPermissionsTransformer';
import { AssetIdentityPermissions } from '@/domain/entities/AssetPermissions';

interface UseGetAssetPermissionsProps {
  asset?: Asset | null;
  assetSdk?: AssetSdk;
}

interface UseGetAssetPermissionsReturn {
  data: AssetIdentityPermissions[] | undefined;
  isLoading: boolean;
  isFetched: boolean;
  error: Error | null;
}

export const useGetAssetPermissions = ({
  asset,
  assetSdk,
}: UseGetAssetPermissionsProps): UseGetAssetPermissionsReturn => {
  const { polymeshService } = usePolymeshSdkService();

  const query = useQuery({
    queryKey: ['assetPermissions', asset?.assetId],
    queryFn: async (): Promise<AssetIdentityPermissions[]> => {
      if (!assetSdk) {
        throw new Error('Required dependencies not initialized');
      }

      const agentsWithPermissions = await assetSdk.permissions.getAgents();

      const transformedPermissions = await Promise.all(
        agentsWithPermissions.map(agentWithGroupToAssetPermissions),
      );

      return transformedPermissions;
    },
    enabled: !!asset && !!polymeshService?.polymeshSdk && !!assetSdk,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetched: query.isFetched,
    error: query.error as Error | null,
  };
};
