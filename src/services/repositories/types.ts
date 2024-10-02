export interface AssetNode {
  ticker: string;
  name: string;
  type: string;
  totalSupply: string;
  divisible: boolean;
  createdAt: string;
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
