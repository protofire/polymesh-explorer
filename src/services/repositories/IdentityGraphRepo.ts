import { GraphQLClient, gql } from 'graphql-request';
import { Identity } from '@/domain/entities/Identity';
import { assetFragment } from './fragments';
import { IdentityListResponse, IdentityResponse } from './types';
import { transformToIdentity } from './transformer';

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
