import { Asset } from './Asset';

interface AssetPortfolio extends Pick<Asset, 'name' | 'ticker' | 'type'> {
  balance: string;
}

export interface Portfolio {
  id: string;
  name: string;
  assets: AssetPortfolio[];
}
