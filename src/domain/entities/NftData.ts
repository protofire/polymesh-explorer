export interface NftCollection {
  collectionId: string;
  ticker?: string;
  assetId: string;
  uuid: string;
  imgUrl: string;
  name: string;
  assetType: string;
  count: number;
}

export interface NftAsset {
  id: number;
  imgUrl: string;
  isLocked: boolean;
  collectionTicker?: string;
  assetId: string;
  collectionName: string;
}

export interface NftData {
  collections: NftCollection[];
  nftAssets: NftAsset[];
}

export interface INftArgs {
  metaKey: string;
  metaValue: string | number | boolean;
  metaDescription?: string;
}

export interface NftAssetWithMetadata extends NftAsset {
  name?: string;
  tokenUri?: string;
  description?: string;
  onChainDetails?: INftArgs[];
  offChainDetails?: INftArgs[];
  ownerDid?: string;
  ownerPortfolioId?: string;
}
