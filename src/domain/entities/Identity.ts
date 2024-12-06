import { Asset } from './Asset';

export interface Identity {
  did: string;
  primaryAccount: string;
  secondaryAccounts: Array<string>;
  createdAt: Date;
  claimsCount: number;
  assetsCount: number;
  venuesCount: number;
  portfoliosCount: number;
  ownedAssets: Asset[];
  heldAssets: Asset[];
  isCustodian: boolean;
  custodiedPortfoliosCount: number;
  isChildIdentity: boolean;
  parentIdentityDid?: string;
  childIdentities?: string[];
}
