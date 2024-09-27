import { GraphQLClient, gql } from 'graphql-request';
import { Identity } from '@/domain/entities/Identity';
import { SearchCriteria } from '@/domain/criteria/SearchCriteria';

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
  };
  venuesByOwnerId: {
    totalCount: number;
  };
  portfolios: {
    totalCount: number;
  };
}

interface IdentityResponse {
  identities: {
    nodes: IdentityNode[];
  };
}

export class GraphIdentityRepo {
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
            }
            venuesByOwnerId {
              totalCount
            }
            portfolios {
              totalCount
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
      secondaryAccounts: identity.secondaryAccounts.nodes.map(
        (node) => node.address,
      ),
      createdAt: identity.createdAt,
      claimsCount: identity.claimsByTargetId.totalCount,
      assetsCount: identity.heldAssets.totalCount,
      venuesCount: identity.venuesByOwnerId.totalCount,
      portfoliosCount: identity.portfolios.totalCount,
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
