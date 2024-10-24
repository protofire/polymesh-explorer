import {
  Account as AccountSdk,
  SubsidyWithAllowance,
  Permissions,
} from '@polymeshassociation/polymesh-sdk/types';
import { Identity } from './Identity';

export type IdentityRelationship =
  | 'Primary'
  | 'Secondary'
  | 'MultiSigSigner'
  | 'Unassigned';

export interface Account {
  key: string;
  identityDid: Identity['did'] | null;
  balance?: string;
  identityRelationship: IdentityRelationship;
  isSmartContract: boolean;
  isMultisig: boolean;
  polymeshSdkClass?: AccountSdk;
}

export interface AccountDetails extends Account {
  permissions: Permissions | null;
  subsidies: {
    beneficiaries: SubsidyWithAllowance[];
    subsidizer: SubsidyWithAllowance | null;
  } | null;
}
