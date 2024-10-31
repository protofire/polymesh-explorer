import { Asset } from './Asset';

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
