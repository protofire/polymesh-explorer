import { Identity } from './Identity';

export interface Account {
  key: string;
  identityDid: Identity['did'] | null;
  balance?: string;
  createdAt: string;
  isMultisig: boolean;
  isPrimaryKey: boolean;
  isSecondaryKey: boolean;
}
