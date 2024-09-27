export interface Identity {
  did: string;
  primaryAccount: string;
  secondaryAccounts: Array<string>;
  createdAt: string;
  claimsCount: number;
  assetsCount: number;
  venuesCount: number;
  portfoliosCount: number;
}
