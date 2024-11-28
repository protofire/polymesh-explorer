import { InstructionStatusEnum } from '@polymeshassociation/polymesh-sdk/types';
import { Portfolio } from '@/domain/entities/Portfolio';
import { PageInfo } from '@/domain/ui/PaginationInfo';

export type { PageInfo };

interface CreatedBlockFields {
  blockId: string;
  datetime: string;
  hash: string;
}

// Assets
export interface AssetNode {
  id: string;
  ticker: string;
  createdBlock: CreatedBlockFields;
  name: string;
  type: string;
  totalSupply: string;
  isNftCollection: boolean;
  isDivisible: boolean;
  owner: {
    did: string;
  };
  documents: {
    totalCount: number;
  };
  holders: {
    totalCount: number;
  };
  nftHolders: {
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

// Asset Holders
export interface AssetHolderNode {
  identityId: string;
  amount: string;
  assetId: string;
}

export interface AssetHoldersResponse {
  assetHolders: {
    totalCount: number;
    pageInfo: PageInfo;
    nodes: AssetHolderNode[];
  };
}

// Nft Holders
export interface NftHoldersNode {
  identityId: string;
  nftIds: Array<string>;
  assetId: string;
}

export interface NftHoldersResponse {
  nftHolders: {
    totalCount: number;
    pageInfo: PageInfo;
    nodes: NftHoldersNode[];
  };
}

// Identity
export interface IdentityNode {
  did: string;
  primaryAccount: string;
  createdBlock: CreatedBlockFields;
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
  createdBlock: CreatedBlockFields;
  details: string;
  type: string;
  ownerId: string;
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
  fundingRound: string | null;
  instruction: null | {
    venueId: string;
  };
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

// Instruction
export interface RawBlock {
  id: string;
  blockId?: number;
  datetime: string;
  hash: string;
}

export interface RawInstructionEvent {
  id: string;
  event: string;
  createdBlock: RawBlock;
}

export interface RawLegNode {
  legIndex: number;
  legType: string;
  from: string;
  fromPortfolio: number;
  to: string;
  toPortfolio: number;
  assetId: string;
  ticker: string;
  amount: string;
  nftIds: string[] | null;
  addresses: string[];
}

export interface RawAffirmationNode {
  identity: string;
  isAutomaticallyAffirmed: boolean;
  isMediator: boolean;
  createdAt: string;
  createdBlockId: string;
  status: string;
  portfolios: number[] | null;
}

export interface RawInstructionNode {
  id: string;
  status: InstructionStatusEnum;
  venue?: {
    id: string;
    details: string;
  };
  type: string;
  endBlock: string | null;
  endAfterBlock: string | null;
  tradeDate: string | null;
  valueDate: string | null;
  legs: {
    nodes: RawLegNode[];
  };
  memo: string | null;
  affirmations: {
    nodes: RawAffirmationNode[];
  };
  mediators: string[];
  failureReason: string | null;
  createdBlock: RawBlock;
  updatedBlock: RawBlock;
  events: {
    nodes: RawInstructionEvent[];
  };
}

export interface InstructionResponse {
  instructions: {
    nodes: RawInstructionNode[];
  };
}
export interface InstructionListResponse {
  instructions: {
    totalCount: number;
    nodes: RawInstructionNode[];
    pageInfo: PageInfo;
  };
}
