import { GraphQLClient, gql } from 'graphql-request';
import { Identity } from '@/domain/entities/Identity';
import { identityFragment, pageInfoFragment } from './fragments';
import { IdentityListResponse, IdentityResponse, PageInfo } from './types';
import { identityNodeToIdentity } from '@/services/repositories/nodeTransformers';

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

  async existsByIdentifier(partialDid: string): Promise<Identity[]> {
    const query = gql`
      ${identityFragment}
      query ($filter: IdentityFilter!) {
        identities(filter: $filter, first: 5) {
          nodes {
            ...IdentityFields
          }
        }
      }
    `;

    const variables = {
      filter: { did: { startsWith: partialDid } },
    };

    const response = await this.client.request<IdentityResponse>(
      query,
      variables,
    );

    return response.identities.nodes.map((node) =>
      identityNodeToIdentity(node),
    );
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
      ${pageInfoFragment}
      query ($first: Int!, $after: Cursor) {
        identities(
          first: $first
          after: $after
          orderBy: CREATED_BLOCK_ID_DESC
        ) {
          totalCount
          pageInfo {
            ...PageInfoFields
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
        month${i}: identities(filter: {datetime: { greaterThanOrEqualTo: "${monthStart.toISOString()}", 
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
