import { Asset } from './Asset';
import { Identity } from './Identity';

export interface AssetPermissions {
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

export interface AssetIdentityPermissions
  extends Pick<AssetPermissions, 'groupType' | 'permissions' | 'permissions'> {
  agent: Partial<Identity>;
}
