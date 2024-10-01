import { GraphQLClient, gql } from 'graphql-request';
import { Identity } from '@/domain/entities/Identity';
import { AssetNode } from './AssetGraphRepo';
import { transformAssetNodeToAsset } from './transformer';
import { assetFragment } from './fragments';

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

interface IdentityResponse {
  identities: {
    nodes: IdentityNode[];
  };
}

interface IdentityListResponse {
  identities: {
    totalCount: number;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
    nodes: IdentityNode[];
  };
}

function transformToIdentity(node: IdentityNode): Identity {
  return {
    did: node.did,
    primaryAccount: node.primaryAccount,
    secondaryAccounts: node.secondaryAccounts.nodes
      .filter((account) => account.address !== node.primaryAccount)
      .map((account) => account.address),
    createdAt: new Date(node.createdAt),
    claimsCount: node.claimsByTargetId.totalCount,
    assetsCount: node.heldAssets.totalCount,
    venuesCount: node.venuesByOwnerId.totalCount,
    portfoliosCount: node.portfolios.totalCount,
    ownedAssets: node.assetsByOwnerId.nodes.map((asset) =>
      transformAssetNodeToAsset(asset),
    ),
    heldAssets: node.heldAssets.nodes.map((heldAsset) =>
      transformAssetNodeToAsset(heldAsset.asset),
    ),
  };
}

export class IdentityGraphRepo {
  constructor(private client: GraphQLClient) {}

  async findByIdentifier(did: string): Promise<Identity | null> {
    const query = gql`
      ${assetFragment}
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
            venuesByOwnerId {
              totalCount
            }
            portfolios {
              totalCount
            }
            heldAssets {
              totalCount
              nodes {
                asset {
                  ...AssetFields
                }
              }
            }
            assetsByOwnerId {
              totalCount
              nodes {
                ...AssetFields
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

    return transformToIdentity(identity);
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
    identities: Identity[];
    totalCount: number;
    hasNextPage: boolean;
    endCursor: string;
  }> {
    const query = gql`
      ${assetFragment}
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
            venuesByOwnerId {
              totalCount
            }
            portfolios {
              totalCount
            }
            heldAssets {
              totalCount
              nodes {
                asset {
                  ...AssetFields
                }
              }
            }
            assetsByOwnerId {
              totalCount
              nodes {
                ...AssetFields
              }
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
      identities: identities.nodes.map((node) => transformToIdentity(node)),
      totalCount: identities.totalCount,
      hasNextPage: identities.pageInfo.hasNextPage,
      endCursor: identities.pageInfo.endCursor,
    };
  }
}
