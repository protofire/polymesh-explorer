import {
  CollectionKey,
  DefaultPortfolio,
  NumberedPortfolio,
  PortfolioCollection,
} from '@polymeshassociation/polymesh-sdk/types';
import { Portfolio } from '@polymeshassociation/polymesh-sdk/api/entities/Portfolio';
import { Nft } from '@polymeshassociation/polymesh-sdk/internal';
import {
  NftAsset,
  NftAssetWithMetadata,
  NftCollection,
} from '@/domain/entities/NftData';

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
      const [{ name, assetType, ticker }, collectionId] = await Promise.all([
        collection.details(),
        collection.getCollectionId(),
      ]);

      const imgUrl = await getNftImageUrl(free[0] || locked[0]);
      return {
        collectionId: collectionId.toString(),
        ticker,
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
      const { name: collectionName, ticker } = await rawCollection.details();
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
            collectionTicker: ticker,
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
            collectionTicker: ticker,
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

function processProperty(attr: {
  trait_type?: string;
  value?: string | number | boolean;
}): {
  metaKey: string;
  metaValue: string | number | boolean;
} {
  const { trait_type: metaKey, value: metaValue } = attr;

  if (!metaKey || metaValue === undefined || metaValue === null) {
    return {
      metaKey: metaKey || 'unknown property',
      metaValue: typeof attr === 'object' ? JSON.stringify(attr) : attr,
    };
  }
  if (typeof metaValue === 'object') {
    return { metaKey, metaValue: JSON.stringify(metaValue) };
  }
  return { metaKey, metaValue };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function processProperties(data: any[] | Record<string, any> | undefined): {
  metaKey: string;
  metaValue: string | number | boolean;
}[] {
  if (!data) {
    return [];
  }

  if (Array.isArray(data)) {
    return data.map((attr) => processProperty(attr));
  }
  if (typeof data === 'object') {
    return Object.entries(data).map(([key, value]) => {
      return processProperty({ trait_type: key, value });
    });
  }

  return [];
}

export const getNftDetails = async (
  nft: Nft,
  isLocked: boolean,
  collectionKeys: CollectionKey[],
  ownerDid: string,
  ownerPortfolioId: string,
): Promise<NftAssetWithMetadata> => {
  const tokenUri = (await getNftTokenUri(nft)) || '';

  const parsedNft = {
    tokenUri,
    isLocked,
    ownerDid,
    ownerPortfolioId,
  } as NftAssetWithMetadata;

  // get off-chain args
  if (tokenUri) {
    const { body, status } = await fetch(tokenUri);
    if (body && status === 200) {
      const reader = body.pipeThrough(new TextDecoderStream()).getReader();
      const rawData = await reader?.read();
      if (rawData.value) {
        const parsedData = JSON.parse(rawData.value);
        const {
          image: imageUri,
          attributes: rawAttributes,
          properties: rawProperties,
          name: rawName,
          description: rawDescription,
          ...rawOtherProperties
        } = parsedData;

        parsedNft.imgUrl = (await getNftImageUrl(nft, imageUri)) || '';

        if (rawAttributes) {
          const attributes = processProperties(rawAttributes);
          parsedNft.offChainDetails = parsedNft.offChainDetails
            ? parsedNft.offChainDetails.concat(attributes)
            : attributes;
        }

        if (rawProperties) {
          const properties = processProperties(rawProperties);
          parsedNft.offChainDetails = parsedNft.offChainDetails
            ? parsedNft.offChainDetails.concat(properties)
            : properties;
        }

        if (rawOtherProperties) {
          const otherProperties = processProperties(rawOtherProperties);
          parsedNft.offChainDetails = parsedNft.offChainDetails
            ? parsedNft.offChainDetails.concat(otherProperties)
            : otherProperties;
        }

        if (rawName) {
          parsedNft.name = rawName;
        }
        if (rawDescription) {
          parsedNft.description = rawDescription;
        }
      }
    }
  } else {
    parsedNft.imgUrl = (await getNftImageUrl(nft)) || '';
  }

  // get on-chain args
  if (collectionKeys?.length) {
    const nftMeta = await nft.getMetadata();

    const args = nftMeta.length
      ? nftMeta.map((meta) => {
          const metaKey = collectionKeys.find(
            (key) =>
              key.id.toNumber() === meta.key.id.toNumber() &&
              key.type === meta.key.type,
          );
          return {
            metaKey: metaKey?.name || 'key',
            metaValue: meta.value,
            metaDescription: metaKey?.specs.description,
          };
        })
      : [];
    parsedNft.onChainDetails = args;
  }

  return parsedNft;
};
