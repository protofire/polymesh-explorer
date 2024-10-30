import {
  AssetDocument,
  CollectionKey,
  SecurityIdentifier,
} from '@polymeshassociation/polymesh-sdk/types';

export interface Asset {
  assetId: string; // Hex format
  assetUuid: string;
  ticker?: string;
  name: string;
  type: string;
  ownerDid: string;
  isNftCollection: boolean;
  isDivisible: boolean;
  createdAt: Date;
  totalSupply: string;
  totalHolders: string;
  totalDocuments: string;
}

export interface AssetMeta {
  name: string;
  description?: string;
  expiry?: Date | string | null;
  isLocked?: string | null;
  lockedUntil?: Date;
  value?: string | null;
}

export interface AssetDetails extends Asset {
  details?: {
    assetIdentifiers: SecurityIdentifier[];
    collectionId?: number;
    collectionKeys: CollectionKey[];
    fundingRound: string | null;
    metaData: AssetMeta[];
    requiredMediators: string[];
    venueFilteringEnabled: boolean;
    permittedVenuesIds: string[];
    isFrozen: boolean;
    docs?: AssetDocument[];
  };
}
