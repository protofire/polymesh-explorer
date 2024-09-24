import { BigNumber } from '@polymeshassociation/polymesh-sdk';

export interface Venue {
  id: BigNumber,
  uuid: string,
  details: {
    description: string
    owner: string
    type: string
  }
}
