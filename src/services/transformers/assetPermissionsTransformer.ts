import {
  AgentWithGroup,
  AssetWithGroup,
  CustomPermissionGroup,
  GroupPermissions,
  KnownPermissionGroup,
  ModuleName,
  PermissionGroupType,
  TransactionPermissions,
  TxTag,
} from '@polymeshassociation/polymesh-sdk/types';
import {
  AssetIdentityPermissions,
  AssetPermissions,
} from '@/domain/entities/AssetPermissions';
import { hexToUuid, uuidToHex } from '../polymesh/hexToUuid';

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

export const assetWithGroupToAssetPermissions = async (
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
      assetId: uuidToHex(asset.id),
      assetUuid: asset.id,
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

export const agentWithGroupToAssetPermissions = async (
  assetWithGroup: AgentWithGroup,
): Promise<AssetIdentityPermissions> => {
  const { agent, group } = assetWithGroup;

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
    agent: {
      did: agent.did,
    },
    permissions: {
      type: groupType,
      ...permissionsInfo,
    },
    groupType,
  };
};
