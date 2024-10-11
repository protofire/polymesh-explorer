import { GraphQLClient, gql } from 'graphql-request';
import { Venue } from '@/domain/entities/Venue';
import { venueNodeToVenue } from './transformer';
import { venueFragment } from './fragments';
import { VenueListResponse, VenueResponse } from './types';

export class VenueGraphRepo {
  constructor(private client: GraphQLClient) {}

  async findById(id: string): Promise<Venue | null> {
    const query = gql`
      ${venueFragment}
      query ($filter: VenueFilter!) {
        venues(filter: $filter, first: 1) {
          nodes {
            ...VenueFields
          }
        }
      }
    `;

    const variables = {
      filter: { id: { equalTo: id } },
    };

    const response = await this.client.request<VenueResponse>(query, variables);
    const venues = response.venues.nodes;

    if (venues.length === 0) return null;

    return venueNodeToVenue(venues[0]);
  }

  async getVenueList(
    first: number,
    after?: string,
  ): Promise<{
    venues: Venue[];
    totalCount: number;
    hasNextPage: boolean;
    endCursor: string;
  }> {
    const query = gql`
      ${venueFragment}
      query ($first: Int!, $after: Cursor) {
        venues(first: $first, after: $after, orderBy: CREATED_AT_DESC) {
          totalCount
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            ...VenueFields
          }
        }
      }
    `;

    const variables = {
      first,
      after,
    };

    const response = await this.client.request<VenueListResponse>(
      query,
      variables,
    );
    const { venues } = response;

    return {
      venues: venues.nodes.map(venueNodeToVenue),
      totalCount: venues.totalCount,
      hasNextPage: venues.pageInfo.hasNextPage,
      endCursor: venues.pageInfo.endCursor,
    };
  }
}
