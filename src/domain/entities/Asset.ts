export interface Asset {
  assetId: string;
  ticker?: string;
  name: string;
  type: string;
  totalSupply: string;
  ownerDid: string;
  isNftCollection: boolean;
  holders: string;
  createdAt: Date;
  documents: string;
}
