import { Portfolio } from './Portfolio';

// export interface PortfolioParty {
//   identityId: string;
//   number: string;
//   name: string;
// }

export interface PortfolioMovement {
  id: string;
  fromId: string;
  from: Portfolio;
  toId: string;
  to: Portfolio;
  assetId: string;
  amount?: string;
  nftIds?: string[];
  address: string;
  memo?: string;
  createdAt: string;
  blockId: string;
}
