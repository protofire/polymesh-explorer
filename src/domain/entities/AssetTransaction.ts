import { Portfolio } from './Portfolio';

export interface AssetTransaction {
  id: string;
  assetId: string;
  fromId: string;
  from?: Portfolio;
  toId: string;
  to?: Portfolio;
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
  memo?: string;
}
