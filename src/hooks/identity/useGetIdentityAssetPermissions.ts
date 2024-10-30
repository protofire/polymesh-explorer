import { useQuery } from '@tanstack/react-query';
import {
  AssetWithGroup,
  KnownPermissionGroup,
  CustomPermissionGroup,
} from '@polymeshassociation/polymesh-sdk/types';
import { Identity } from '@/domain/entities/Identity';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';

interface Asset {
  ticker: string;
  did: string;
}

interface AssetPermissions {
  asset: Asset;
  permissions: string[];
  groupType:
    | 'Full'
    | 'Custom'
    | 'ExceptMeta'
    | 'PolymeshV1Caa'
    | 'PolymeshV1Pia';
}

type PermissionGroup = KnownPermissionGroup | CustomPermissionGroup;

interface UseGetIdentityAssetPermissionsProps {
  identity?: Identity | null;
}

interface UseGetIdentityAssetPermissionsReturn {
  data: AssetPermissions[] | undefined;
  isLoading: boolean;
  isFetched: boolean;
  error: Error | null;
}

const transformPermissions = (
  assetWithGroup: AssetWithGroup,
): AssetPermissions => {
  const { asset, group } = assetWithGroup;

  let permissions: string[] = [];
  let groupType: AssetPermissions['groupType'] = 'Full';

  if ('permissions' in group) {
    permissions = group.permissions.values;
    groupType = 'Custom';
  } else {
    switch (group.type) {
      case 'Full':
        permissions = ['Full Access'];
        groupType = 'Full';
        break;
      case 'ExceptMeta':
        permissions = ['All except meta transactions'];
        groupType = 'ExceptMeta';
        break;
      case 'PolymeshV1Caa':
        permissions = ['Corporate Actions'];
        groupType = 'PolymeshV1Caa';
        break;
      case 'PolymeshV1Pia':
        permissions = ['Primary Issuance'];
        groupType = 'PolymeshV1Pia';
        break;
      default:
        permissions = ['Unknown'];
        groupType = 'Full';
    }
  }

  return {
    asset: {
      ticker: asset.ticker || '',
      did: asset.did || '',
    },
    permissions,
    groupType,
  };
};

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
      return assetPermissions.map(transformPermissions);
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
