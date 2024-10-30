import { KnownPermissionGroup, CustomPermissionGroup } from '@polymeshassociation/polymesh-sdk/types';

export interface Asset {
  ticker: string;
  did: string;
}

export interface AssetPermissions {
  asset: Asset;
  permissions: string[];
  groupType: 'Full' | 'Custom' | 'ExceptMeta' | 'PolymeshV1Caa' | 'PolymeshV1Pia';
}

export type PermissionGroup = KnownPermissionGroup | CustomPermissionGroup; 