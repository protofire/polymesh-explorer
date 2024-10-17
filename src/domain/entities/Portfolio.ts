import { Portfolio as PortfolioSdk } from '@polymeshassociation/polymesh-sdk/api/entities/Portfolio';
import { Asset } from './Asset';
import { Identity } from './Identity';
import { NftData } from './NftData';

export interface AssetPortfolio
  extends Pick<Asset, 'name' | 'ticker' | 'type'> {
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
  portfolioSdk: PortfolioSdk;
}
