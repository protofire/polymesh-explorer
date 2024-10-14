export interface Asset {
  ticker: string;
  name: string;
  type: string;
  totalSupply: string;
  ownerDid: string;
  isNftCollection: boolean;
  holders: string;
  createdAt: Date;
  documents: string;
}
