import {
  DefaultPortfolio,
  NumberedPortfolio,
  PortfolioCollection,
} from '@polymeshassociation/polymesh-sdk/types';
import { Portfolio } from '@polymeshassociation/polymesh-sdk/api/entities/Portfolio';
import { Nft } from '@polymeshassociation/polymesh-sdk/internal';
import { NftAsset, NftCollection } from '@/domain/entities/NftData';

const IPFS_PROVIDER_URL = 'https://ipfs.io/ipfs';
const imageUrlCache = new Map();

export const convertIpfsLink = (uri: string): string => {
  const rawIpfsUrl: string = IPFS_PROVIDER_URL;
  const ipfsUrl =
    rawIpfsUrl.charAt(rawIpfsUrl.length - 1) === '/'
      ? rawIpfsUrl
      : `${rawIpfsUrl}/`;

  return uri.startsWith('ipfs://') ? `${uri.replace('ipfs://', ipfsUrl)}` : uri;
};

export const getNftTokenUri = async (nft: Nft): Promise<string | null> => {
  const tokenUri = await nft.getTokenUri();
  return tokenUri ? convertIpfsLink(tokenUri) : null;
};

export const getExternalNftImageUrl = async (
  nft: Nft,
): Promise<string | null> => {
  const tokenUri = await getNftTokenUri(nft);
  if (!tokenUri) {
    return null;
  }
  const { body, status } = await fetch(tokenUri);
  if (!body || status !== 200) {
    return null;
  }
  const reader = body.pipeThrough(new TextDecoderStream()).getReader();
  const rawData = await reader?.read();
  if (!rawData.value) {
    return null;
  }
  const parsedData = JSON.parse(rawData.value);

  if (!parsedData.image) {
    return null;
  }

  return convertIpfsLink(parsedData.image);
};

export const getNftImageUrl = async (
  nft: Nft,
  image?: string | null,
): Promise<string | null> => {
  let imageUri = await nft.getImageUri();
  if (!imageUri) {
    if (!image) {
      imageUri = await getExternalNftImageUrl(nft);
    } else {
      imageUri = image;
    }
  }
  return imageUri ? convertIpfsLink(imageUri) : null;
};

export async function getCollectionsFromPortfolio(
  portfolio: DefaultPortfolio | NumberedPortfolio,
): Promise<NftCollection[]> {
  const collectionsList: PortfolioCollection[] =
    await portfolio.getCollections();
  return Promise.all(
    collectionsList.map(async ({ collection, free, locked, total }) => {
      const [{ name, assetType }, collectionId] = await Promise.all([
        collection.details(),
        collection.getCollectionId(),
      ]);

      const imgUrl = await getNftImageUrl(free[0] || locked[0]);
      return {
        collectionId: collectionId.toString(),
        ticker: collection.ticker,
        assetId: collection.id,
        imgUrl: imgUrl || '',
        uuid: collection.uuid,
        name,
        assetType,
        count: total.toNumber(),
      };
    }),
  );
}

export async function getNftAssetsFromPortfolio(
  portfolio: Portfolio,
): Promise<NftAsset[]> {
  const collectionsList = await portfolio.getCollections();
  const parsedNftsList = await Promise.all(
    collectionsList.map(async ({ free, locked, collection: rawCollection }) => {
      const { name: collectionName } = await rawCollection.details();
      const freeNfts = await Promise.all(
        free.map(async (nft) => {
          let imgUrl = imageUrlCache.get(nft.uuid);
          if (!imgUrl) {
            imgUrl = await getNftImageUrl(nft);
            imageUrlCache.set(nft.uuid, imgUrl);
          }

          return {
            id: nft.id.toNumber(),
            imgUrl,
            isLocked: false,
            collectionTicker: rawCollection.ticker,
            assetId: rawCollection.id,
            collectionName,
          };
        }),
      );
      const lockedNfts = await Promise.all(
        locked.map(async (nft) => {
          let imgUrl = imageUrlCache.get(nft.uuid);
          if (!imgUrl) {
            imgUrl = await getNftImageUrl(nft);
            imageUrlCache.set(nft.uuid, imgUrl);
          }

          return {
            id: nft.id.toNumber(),
            imgUrl,
            isLocked: true,
            collectionTicker: rawCollection.ticker,
            assetId: rawCollection.id,
            collectionName,
          };
        }),
      );
      return [...freeNfts, ...lockedNfts];
    }),
  );
  return parsedNftsList.flat();
}
