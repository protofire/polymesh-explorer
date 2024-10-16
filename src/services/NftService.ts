import { Nft, Portfolio } from '@polymeshassociation/polymesh-sdk/types';
import { PolymeshSdkService } from './PolymeshSdkService';

export interface NftCollection {
  collectionId: string;
  ticker: {
    ticker: string;
    imgUrl: string;
  };
  name: string;
  assetType: string;
  count: number;
}

export interface NftAsset {
  id: number;
  ticker: {
    imgUrl: string;
  };
  isLocked: boolean;
  collectionTicker: string;
  collectionName: string;
}

export class NftService {
  constructor(private polymeshSdkService: PolymeshSdkService) {}

  private async getExternalNftImageUrl(nft: Nft): Promise<string | null> {
    // Implementa la lógica de getExternalNftImageUrl aquí
  }

  private async getNftImageUrl(nft: Nft, image?: string | null): Promise<string | null> {
    // Implementa la lógica de getNftImageUrl aquí
  }

  async getCollectionsFromPortfolio(portfolio: Portfolio): Promise<NftCollection[]> {
    const collectionsList = await portfolio.getCollections();
    return Promise.all(
      collectionsList.map(async ({ collection, free, locked, total }) => {
        const [{ name, assetType }, collectionId] = await Promise.all([
          collection.details(),
          collection.getCollectionId(),
        ]);

        const imgUrl = await this.getNftImageUrl(free[0] || locked[0]);
        return {
          collectionId: collectionId.toString(),
          ticker: {
            ticker: collection.ticker,
            imgUrl: imgUrl || '',
          },
          name,
          assetType,
          count: total.toNumber(),
        };
      })
    );
  }

  async getNftAssetsFromPortfolio(portfolio: Portfolio): Promise<NftAsset[]> {
    const collectionsList = await portfolio.getCollections();
    const parsedNftsList = await Promise.all(
      collectionsList.map(async ({ free, locked, collection: rawCollection }) => {
        const { name: collectionName } = await rawCollection.details();
        const freeNfts = await Promise.all(
          free.map(async (nft) => ({
            id: nft.id.toNumber(),
            ticker: { imgUrl: '' },
            isLocked: false,
            collectionTicker: rawCollection.ticker,
            collectionName,
          }))
        );
        const lockedNfts = await Promise.all(
          locked.map(async (nft) => ({
            id: nft.id.toNumber(),
            ticker: { imgUrl: '' },
            isLocked: true,
            collectionTicker: rawCollection.ticker,
            collectionName,
          }))
        );
        return [...freeNfts, ...lockedNfts];
      })
    );
    return parsedNftsList.flat();
  }
}
