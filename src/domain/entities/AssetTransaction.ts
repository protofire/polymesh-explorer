import { Portfolio } from './Portfolio';

export interface AssetTransaction {
  id: string;
  assetId: string;
  assetTicker: string;
  fromId?: string;
  from?: Portfolio;
  fromAccount?: string;
  fromIdentityId?: string;
  toId?: string;
  to?: Portfolio;
  toAccount?: string;
  toIdentityId?: string;
  amount?: string;
  nftIds?: string[];
  createdBlock: {
    blockId: string;
    datetime: Date;
  };
  extrinsicIdx: number;
  eventIdx: number;
  eventId: string;
  instructionId?: string;
  venueId?: string;
  memo?: string;
  fundingRound?: string;
}
