import { useQuery } from '@tanstack/react-query';
import { Identity } from '@/domain/entities/Identity';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { AssetPermissions } from '@/domain/entities/AssetPermissions';
import { agentWithGroupToAssetPermissions, assetWithGroupToAssetPermissions } from '@/services/transformers/assetPermissionsTransformer';

interface UseGetIdentityAssetPermissionsProps {
  identity?: Identity | null;
}

interface UseGetIdentityAssetPermissionsReturn {
  data: AssetPermissions[] | undefined;
  isLoading: boolean;
  isFetched: boolean;
  error: Error | null;
}

export const useGetIdentityAssetPermissions = ({
  identity,
}: UseGetIdentityAssetPermissionsProps): UseGetIdentityAssetPermissionsReturn => {
  const { polymeshService } = usePolymeshSdkService();

  const query = useQuery({
    queryKey: ['identityAssetPermissions', identity?.did],
    queryFn: async (): Promise<AssetPermissions[]> => {
      if (!polymeshService?.polymeshSdk || !identity) {
        throw new Error('Polymesh SDK not initialized');
      }

      const polymeshIdentity =
        await polymeshService.polymeshSdk.identities.getIdentity({
          did: identity.did,
        });

      const assetPermissions = await polymeshIdentity.assetPermissions.get();
      const transformedPermissions = await Promise.all(
        assetPermissions.map(assetWithGroupToAssetPermissions),
      );
      return transformedPermissions;
    },
    enabled: !!identity && !!polymeshService?.polymeshSdk,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetched: query.isFetched,
    error: query.error as Error | null,
  };
};
