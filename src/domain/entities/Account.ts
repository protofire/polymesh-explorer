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
}
