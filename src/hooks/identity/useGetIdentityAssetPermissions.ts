import { useQuery } from '@tanstack/react-query';
import {
  AssetWithGroup,
  KnownPermissionGroup,
  CustomPermissionGroup,
  GroupPermissions,
  TxTag,
  ModuleName,
  TransactionPermissions,
  PermissionGroupType,
} from '@polymeshassociation/polymesh-sdk/types';
import { Identity } from '@/domain/entities/Identity';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Asset } from '@/domain/entities/Asset';
import { hexToUuid } from '@/services/polymesh/hexToUuid';

interface AssetPermissions {
  asset: Partial<Asset>;
  permissions: {
    type: string;
    description: string;
    details: string[];
  };
  groupType:
    | 'Full'
    | 'Custom'
    | 'ExceptMeta'
    | 'PolymeshV1Caa'
    | 'PolymeshV1Pia';
}

interface UseGetIdentityAssetPermissionsProps {
  identity?: Identity | null;
}

interface UseGetIdentityAssetPermissionsReturn {
  data: AssetPermissions[] | undefined;
  isLoading: boolean;
  isFetched: boolean;
  error: Error | null;
}

const isCustomPermissionGroup = (
  group: KnownPermissionGroup | CustomPermissionGroup,
): group is CustomPermissionGroup => {
  return 'id' in group;
};

const getKnownGroupDescription = (
  type: PermissionGroupType,
): { description: string; details: string[] } => {
  switch (type) {
    case 'Full':
      return {
        description: 'Full Access',
        details: ['Can execute all asset transactions'],
      };
    case 'ExceptMeta':
      return {
        description: 'All except meta transactions',
        details: [
          'Can execute all asset transactions except meta transactions',
        ],
      };
    case 'PolymeshV1Caa':
      return {
        description: 'Corporate Actions Agent',
        details: [
          'Can execute corporate actions',
          'Can manage corporate ballots',
          'Can handle capital distribution',
        ],
      };
    case 'PolymeshV1Pia':
      return {
        description: 'Primary Issuance Agent',
        details: [
          'Can issue tokens',
          'Can redeem tokens',
          'Can perform controller transfers',
          'Can manage STOs (except investing)',
        ],
      };
    default:
      return {
        description: 'Unknown Permission Group',
        details: [],
      };
  }
};

const formatCustomPermissions = (
  permissions: GroupPermissions,
): { description: string; details: string[] } => {
  const details: string[] = [];

  if (permissions.transactions) {
    const txPerms = permissions.transactions as TransactionPermissions;
    const { values, type } = txPerms;

    if (type === 'Include') {
      details.push(
        ...values.map((v: TxTag | ModuleName) => `Can execute: ${String(v)}`),
      );
    } else {
      details.push(
        ...values.map(
          (v: TxTag | ModuleName) => `Cannot execute: ${String(v)}`,
        ),
      );
    }

    if (txPerms.exceptions) {
      details.push(
        ...txPerms.exceptions.map((v: TxTag) => `Exception: ${String(v)}`),
      );
    }
  }

  if (permissions.transactionGroups) {
    details.push(
      ...permissions.transactionGroups.map(
        (group) => `Has all permissions in group: ${group}`,
      ),
    );
  }

  return {
    description: 'Custom Permissions Group',
    details: details.length ? details : ['No specific permissions defined'],
  };
};

const transformPermissions = async (
  assetWithGroup: AssetWithGroup,
): Promise<AssetPermissions> => {
  const { asset, group } = assetWithGroup;
  const assetDetails = await asset.details();

  let permissionsInfo: { description: string; details: string[] };
  let groupType: AssetPermissions['groupType'] = 'Full';

  if (isCustomPermissionGroup(group)) {
    const groupPermissions = await group.getPermissions();
    permissionsInfo = formatCustomPermissions(groupPermissions);
    groupType = 'Custom';
  } else {
    groupType = group.type;
    permissionsInfo = getKnownGroupDescription(group.type);
  }

  return {
    asset: {
      assetId: asset.id,
      assetUuid: hexToUuid(asset.id),
      ticker: assetDetails.ticker,
      name: assetDetails.name,
      type: assetDetails.assetType,
      ownerDid: assetDetails.owner.did,
      isNftCollection: assetDetails.nonFungible,
      isDivisible: assetDetails.isDivisible,
    },
    permissions: {
      type: groupType,
      ...permissionsInfo,
    },
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
      const transformedPermissions = await Promise.all(
        assetPermissions.map(transformPermissions),
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
