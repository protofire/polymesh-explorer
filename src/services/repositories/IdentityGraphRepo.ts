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
        id: string;
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
      id: string;
    }[];
  };
}

interface IdentityResponse {
  identities: {
    nodes: IdentityNode[];
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
                  id
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
                id
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
        id: asset.id,
      })),
      heldAssets: identity.heldAssets.nodes.map((node) => ({
        ticker: node.asset.ticker,
        name: node.asset.name,
        id: node.id,
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
}
