import { Portfolio } from '@/domain/entities/Portfolio';

export interface PortfolioMovement {
  id: string;
  fromId: string;
  from: Portfolio;
  toId: string;
  to: Portfolio;
  assetId: string;
  assetTicker: string;
  amount?: string;
  nftIds?: string[];
  address: string;
  memo?: string;
  createdAt: string;
  blockId: string;
}
