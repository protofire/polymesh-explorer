import {
  Account as AccountSdk,
  SubsidyWithAllowance,
  Permissions as RawPermissions,
  TxTag,
  ModuleName,
} from '@polymeshassociation/polymesh-sdk/types';
import { Identity } from './Identity';
import { Asset } from './Asset';
import { Portfolio } from './Portfolio';

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

export interface SectionPermissions<T> {
  type: 'Include' | 'Exclude';
  values: T[];
}

export interface Permissions
  extends Omit<RawPermissions, 'assets' | 'portfolios'> {
  assets: SectionPermissions<Asset> | null;
  portfolios: SectionPermissions<Portfolio> | null;
}

export interface AccountDetails extends Account {
  permissions: Permissions | null;
  subsidies: {
    beneficiaries: SubsidyWithAllowance[];
    subsidizer: SubsidyWithAllowance | null;
  } | null;
}

export interface TransactionPermissions {
  type: 'Include' | 'Exclude';
  values: (TxTag | ModuleName)[];
  exceptions?: TxTag[];
}

export interface AccountPermissions {
  assets: SectionPermissions<{ ticker: string }> | null;
  transactions: TransactionPermissions | null;
  transactionGroups: string[];
  portfolios: SectionPermissions<{ id: string }> | null;
}
