import { GraphQLClient, gql } from 'graphql-request';
import { Identity } from '@/domain/entities/Identity';
import { identityFragment } from './fragments';
import { IdentityListResponse, IdentityResponse, PageInfo } from './types';
import { identityNodeToIdentity } from './transformer';

export class IdentityGraphRepo {
  constructor(private client: GraphQLClient) {}

  async findByIdentifier(did: string): Promise<Identity | null> {
    const query = gql`
      ${identityFragment}
      query ($filter: IdentityFilter!) {
        identities(filter: $filter, first: 1) {
          nodes {
            ...IdentityFields
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

    return identityNodeToIdentity(identity);
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
    pageInfo: PageInfo;
  }> {
    const query = gql`
      ${identityFragment}
      query ($first: Int!, $after: Cursor) {
        identities(first: $first, after: $after, orderBy: CREATED_AT_DESC) {
          totalCount
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          nodes {
            ...IdentityFields
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
      identities: identities.nodes.map((node) => identityNodeToIdentity(node)),
      totalCount: identities.totalCount,
      pageInfo: identities.pageInfo,
    };
  }

  async getIdentityCreationCountByMonth(
    months: number = 12,
  ): Promise<{ date: string; count: number }[]> {
    const endDate = new Date();
    const queries = [];

    for (let i = 0; i < months; i += 1) {
      const monthStart = new Date(
        endDate.getFullYear(),
        endDate.getMonth() - i,
        1,
      );
      const monthEnd = new Date(
        endDate.getFullYear(),
        endDate.getMonth() - i + 1,
        0,
        23,
        59,
        59,
        999,
      );

      queries.push(`
        month${i}: identities(filter: {createdAt: { greaterThanOrEqualTo: "${monthStart.toISOString()}", 
                              lessThanOrEqualTo: "${monthEnd.toISOString()}"}}) {
          aggregates {
            distinctCount {
              did 
            }
          }
        }
      `);
    }

    const query = gql`
      query GetIdentityCreationCountByMonth {
        ${queries.join('\n')}
      }
    `;

    const response =
      await this.client.request<
        Record<string, { aggregates: { distinctCount: { did: number } } }>
      >(query);

    const result = Object.entries(response).map(([key, value]) => {
      const monthIndex = parseInt(key.replace('month', ''), 10);
      const date = new Date(
        endDate.getFullYear(),
        endDate.getMonth() - monthIndex,
        1,
      );
      return {
        date: date.toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        }),
        count: value.aggregates.distinctCount.did,
      };
    });

    return result.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }
}
