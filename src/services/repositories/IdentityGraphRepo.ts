import { GraphQLClient, gql } from 'graphql-request';
import { Identity } from '@/domain/entities/Identity';

interface IdentityNode {
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
      asset: {
        ticker: string;
        name: string;
        type: string;
      };
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
    nodes: {
      ticker: string;
      name: string;
      type: string;
    }[];
  };
}

interface IdentityResponse {
  identities: {
    nodes: IdentityNode[];
  };
}

interface IdentityListNode {
  did: string;
  primaryAccount: string;
  portfolios: {
    totalCount: number;
  };
  claimsByTargetId: {
    totalCount: number;
  };
  extrinsics: {
    nodes: {
      hash: string;
      module: string;
      call: string;
      success: boolean;
      blockId: string;
    }[];
  };
  custodianForPortfolios: {
    totalCount: number;
  };
}

interface IdentityListResponse {
  identities: {
    totalCount: number;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
    nodes: IdentityListNode[];
  };
}

export class IdentityGraphRepo {
  constructor(private client: GraphQLClient) {}

  async findByIdentifier(did: string): Promise<Identity | null> {
    const query = gql`
      query ($filter: IdentityFilter!) {
        identities(filter: $filter, first: 1) {
          nodes {
            did
            primaryAccount
            createdAt
            secondaryAccounts {
              totalCount
              nodes {
                address
              }
            }
            claimsByTargetId {
              totalCount
            }
            heldAssets {
              totalCount
              nodes {
                asset {
                  ticker
                  name
                  type
                }
              }
            }
            venuesByOwnerId {
              totalCount
            }
            portfolios {
              totalCount
            }
            assetsByOwnerId {
              totalCount
              nodes {
                ticker
                name
                type
              }
            }
          }
        }
      }
    `;

    const variables = {
      filter: { did: { equalTo: did } },
    };

    const response = await this.client.request<IdentityResponse>(
      query,
      variables,
    );
    const identities = response.identities.nodes;

    if (identities.length === 0) return null;

    const identity = identities[0];

    return {
      did: identity.did,
      primaryAccount: identity.primaryAccount,
      secondaryAccounts: identity.secondaryAccounts.nodes
        .filter((node) => node.address !== identity.primaryAccount)
        .map((node) => node.address),
      createdAt: identity.createdAt,
      claimsCount: identity.claimsByTargetId.totalCount,
      assetsCount: identity.heldAssets.totalCount,
      venuesCount: identity.venuesByOwnerId.totalCount,
      portfoliosCount: identity.portfolios.totalCount,
      ownedAssets: identity.assetsByOwnerId.nodes.map((asset) => ({
        ticker: asset.ticker,
        name: asset.name,
        type: asset.type,
      })),
      heldAssets: identity.heldAssets.nodes.map((node) => ({
        ticker: node.asset.ticker,
        name: node.asset.name,
        type: node.asset.type,
      })),
    };
  }

  async existsByIdentifier(did: string): Promise<boolean> {
    const query = gql`
      query ($filter: IdentityFilter!) {
        identities(filter: $filter, first: 1) {
          nodes {
            did
          }
        }
      }
    `;

    const variables = {
      filter: { did: { equalTo: did } },
    };

    const response = await this.client.request<IdentityResponse>(
      query,
      variables,
    );
    const identities = response.identities.nodes;

    return identities.length > 0;
  }

  async getIdentityList(
    first: number,
    after?: string,
  ): Promise<{
    identities: {
      did: string;
      primaryAccount: string;
      portfoliosCount: number;
      claimsCount: number;
      recentActivity: {
        hash: string;
        module: string;
        call: string;
        success: boolean;
        blockId: string;
      } | null;
      isCustodian: boolean;
    }[];
    totalCount: number;
    hasNextPage: boolean;
    endCursor: string;
  }> {
    const query = gql`
      query ($first: Int!, $after: Cursor) {
        identities(first: $first, after: $after) {
          totalCount
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            did
            primaryAccount
            portfolios {
              totalCount
            }
            claimsByTargetId {
              totalCount
            }
          }
        }
      }
    `;

    const variables = {
      first,
      after,
    };

    const response = await this.client.request<IdentityListResponse>(
      query,
      variables,
    );
    const { identities } = response;

    return {
      identities: identities.nodes.map((node) => ({
        did: node.did,
        primaryAccount: node.primaryAccount,
        portfoliosCount: node.portfolios.totalCount,
        claimsCount: node.claimsByTargetId.totalCount,
      })),
      totalCount: identities.totalCount,
      hasNextPage: identities.pageInfo.hasNextPage,
      endCursor: identities.pageInfo.endCursor,
    };
  }
}
