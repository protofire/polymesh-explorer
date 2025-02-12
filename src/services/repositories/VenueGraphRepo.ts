import { GraphQLClient, gql } from 'graphql-request';
import { Venue } from '@/domain/entities/Venue';
import { venueNodeToVenue } from '@/services/repositories/nodeTransformers';
import { pageInfoFragment, venueFragment } from './fragments';
import { PageInfo, VenueListResponse, VenueResponse } from './types';

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
    pageInfo: PageInfo;
  }> {
    const query = gql`
      ${venueFragment}
      ${pageInfoFragment}
      query ($first: Int!, $after: Cursor) {
        venues(first: $first, after: $after, orderBy: CREATED_BLOCK_ID_DESC) {
          totalCount
          pageInfo {
            ...PageInfoFields
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
      pageInfo: venues.pageInfo,
    };
  }
}
