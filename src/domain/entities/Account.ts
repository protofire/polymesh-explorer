import { Identity } from './Identity';

export interface Account {
  key: string;
  identityId: Identity['did'] | null;
  createdAt: string;
  isMultisig: boolean;
  isPrimaryKey: boolean;
  isSecondaryKey: boolean;
}
