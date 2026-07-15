import { Portfolio } from '@/domain/entities/Portfolio';

export interface PortfolioMovement {
  id: string;
  fromAccount?: string;
  from?: Portfolio;
  toAccount?: string;
  to?: Portfolio;
  assetId: string;
  assetTicker?: string;
  amount?: string;
  nftIds?: string[];
  address: string;
  memo?: string;
  createdAt: Date;
  blockId: string;
}
