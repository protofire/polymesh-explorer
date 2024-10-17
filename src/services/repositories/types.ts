import { Portfolio } from '@/domain/entities/Portfolio';
import { PageInfo } from '@/domain/ui/PaginationInfo';

export type { PageInfo };

// Assets
export interface AssetNode {
  ticker: string;
  name: string;
  type: string;
  totalSupply: string;
  divisible: boolean;
  createdAt: string;
  isNftCollection: boolean;
  owner: {
    did: string;
  };
  documents: {
    totalCount: number;
  };
  holders: {
    totalCount: number;
  };
}

export interface AssetResponse {
  assets: {
    nodes: AssetNode[];
  };
}

export interface AssetListResponse {
  assets: {
    totalCount: number;
    pageInfo: PageInfo;
    nodes: AssetNode[];
  };
}

// Identity
export interface IdentityNode {
  did: string;
  primaryAccount: string;
  createdAt: string;
  secondaryAccounts: {
    totalCount: number;
    nodes: { address: string }[];
  };
  claimsByTargetId: {
    totalCount: number;
  };
  venuesByOwnerId: {
    totalCount: number;
  };
  portfolios: {
    totalCount: number;
  };
  heldAssets: {
    totalCount: number;
    nodes: {
      asset: AssetNode;
    }[];
  };
  assetsByOwnerId: {
    totalCount: number;
    nodes: AssetNode[];
  };
  heldNfts: {
    totalCount: number;
    nodes: {
      asset: AssetNode;
    }[];
  };
  portfoliosByCustodianId: {
    totalCount: number;
    nodes: {
      id: string;
    }[];
  };
  parentChildIdentities: {
    totalCount: number;
    nodes: {
      parentId: string;
    }[];
  };
}

export interface IdentityResponse {
  identities: {
    nodes: IdentityNode[];
  };
}

export interface IdentityListResponse {
  identities: {
    totalCount: number;
    pageInfo: PageInfo;
    nodes: IdentityNode[];
  };
}

// Venue
export interface VenueNode {
  id: string;
  details: string;
  type: string;
  ownerId: string;
  createdAt: string;
}

export interface VenueResponse {
  venues: {
    nodes: VenueNode[];
  };
}

export interface VenueListResponse {
  venues: {
    totalCount: number;
    pageInfo: PageInfo;
    nodes: VenueNode[];
  };
}

// Portfolio
export interface PortfolioMovementNode {
  id: string;
  fromId: string;
  from: Portfolio;
  toId: string;
  to: Portfolio;
  assetId: string;
  asset: {
    ticker: string;
    id: string;
  };
  amount?: string;
  nftIds?: string[];
  address: string;
  memo?: string;
  createdBlock: {
    blockId: string;
    datetime: string;
  };
}

export interface PortfolioMovementsResponse {
  portfolioMovements: {
    totalCount: number;
    pageInfo: PageInfo;
    nodes: PortfolioMovementNode[];
  };
}

export interface AssetTransactionNode {
  id: string;
  fromPortfolioId: string;
  toPortfolioId: string;
  assetId: string;
  asset: {
    ticker: string;
  };
  amount: string;
  nftIds: string[] | null;
  datetime: string;
  createdBlockId: string;
  extrinsicIdx: number;
  eventIdx: number;
  eventId: string;
  instructionId: string | null;
  instructionMemo: string | null;
}

export interface AssetTransactionsResponse {
  assetTransactions: {
    totalCount: number;
    pageInfo: PageInfo;
    nodes: AssetTransactionNode[];
  };
}

// Extrinsics (History Accounts)
export interface ExtrinsicNode {
  blockId: string;
  extrinsicIdx: number;
  address: string;
  nonce: number;
  moduleId: string;
  callId: string;
  paramsTxt: string;
  success: boolean;
  specVersionId: number;
  extrinsicHash: string;
  block: {
    hash: string;
    datetime: string;
  };
}

export interface ExtrinsicResponse {
  totalCount: number;
  nodes: ExtrinsicNode[];
  pageInfo: PageInfo;
}
