import { Asset } from './Asset';

export interface Portfolio {
  id: string;
  name: string;
  assets: Asset[];
}
