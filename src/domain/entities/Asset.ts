import {
  BaseAsset,
  MetadataEntry,
} from '@polymeshassociation/polymesh-sdk/internal';
import {
  Requirement,
  TrustedClaimIssuer,
} from '@polymeshassociation/polymesh-sdk/types';

export interface Asset {
  assetId: string;
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
  polymeshSdkClass?: BaseAsset;
}

export interface AssetHolder {
  did: string;
  balance: string;
  percentage: number;
}

export interface AssetTransaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  timestamp: string;
  venue: string;
}

export interface NftMetadata {
  id: string;
  metadata: Record<string, unknown>;
}

export interface IssuerInfo {
  companyName: string;
  registrationNumber: string;
  jurisdiction: string;
  regulatoryStatus: string;
}

export interface AssetDetails extends Asset {
  metadata: MetadataEntry[] | null;
  compliance: {
    requirements: Requirement[];
    transfersAreFrozen: boolean;
  } | null;
  trustedClaimIssuers: TrustedClaimIssuer<true>[] | null;
  allowedVenues?: string[];
  agents?: string[];
  holders?: AssetHolder[];
  transactions?: AssetTransaction[];
  nftMetadata?: NftMetadata[];
  issuerInfo?: IssuerInfo;
}
