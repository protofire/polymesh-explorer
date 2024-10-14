import { PortfolioParty } from '@/domain/entities/PortfolioMovement';

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
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
    nodes: AssetNode[];
  };
}

// Identity
export interface IdentityNode {
  did: string;
  primaryAccount: string;
  secondaryAccounts: {
    totalCount: number;
    nodes: { address: string }[];
  };
  createdAt: string;
  claimsByTargetId: {
    totalCount: number;
  };
  heldAssets: {
    totalCount: number;
    nodes: {
      asset: AssetNode;
    }[];
  };
  venuesByOwnerId: {
    totalCount: number;
  };
  portfolios: {
    totalCount: number;
  };
  assetsByOwnerId: {
    totalCount: number;
    nodes: AssetNode[];
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
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
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
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
    nodes: VenueNode[];
  };
}

// Portfolio
export interface PortfolioMovementNode {
  id: string;
  fromId: string;
  from: PortfolioParty;
  toId: string;
  to: PortfolioParty;
  assetId: string;
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
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
    nodes: PortfolioMovementNode[];
  };
}

export interface AssetTransactionNode {
  amount: string | null;
  assetId: string;
  nftIds: string[] | null;
  datetime: string;
  id: string;
  createdBlockId: string;
  extrinsicIdx: number;
  eventIdx: number;
  eventId: string;
  toPortfolioId: string;
  fromPortfolioId: string;
  instructionId: string | null;
  instructionMemo: string | null;
}

export interface AssetTransactionsResponse {
  assetTransactions: {
    totalCount: number;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
    nodes: AssetTransactionNode[];
  };
}
