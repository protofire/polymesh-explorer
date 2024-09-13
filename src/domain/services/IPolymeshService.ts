import { Polymesh } from '@polymeshassociation/polymesh-sdk';

export interface IPolymeshService {
  getInstance(): Promise<Polymesh>;
}
