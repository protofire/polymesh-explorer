import { Portfolio as PortfolioSdk } from '@polymeshassociation/polymesh-sdk/api/entities/Portfolio';
import { Asset } from './Asset';
import { Identity } from './Identity';
import { NftData } from './NftData';

export const DEFAULT_PORTFOLIO_NAME = 'Default';

export interface AssetPortfolio
  extends Pick<Asset, 'assetId'>,
    Partial<Omit<Asset, 'assetId'>> {
  balance: string;
}

export interface Portfolio {
  id: string;
  name: string;
  number: string;
}

export interface PortfolioWithAssets extends Portfolio {
  assets: AssetPortfolio[];
  nonFungibleAssets?: NftData;
  custodianDid?: Identity['did'];
  otherOwner?: Identity['did'];
  portfolioSdk: PortfolioSdk;
}
