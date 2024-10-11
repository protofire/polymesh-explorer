import { GraphQLClient, gql } from 'graphql-request';
import { PortfolioMovement } from '@/domain/entities/PortfolioMovement';
import { portfolioMovementNodeToPortfolioMovement } from './transformer';
import { PortfolioMovementsResponse } from './types';

export type PortfolioMovementType = 'Fungible' | 'NonFungible';

export class PortfolioMovementsGraphRepo {
  constructor(private client: GraphQLClient) {}

  async getPortfolioMovements(
    pageSize: number,
    portfolioNumber: string,
    type: PortfolioMovementType,
    offset: number = 0,
  ): Promise<{
    movements: PortfolioMovement[];
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
  }> {
    const assetDetail = type === 'Fungible' ? 'amount' : 'nftIds';

    const query = gql`
      query ($pageSize: Int!, $offset: Int!, $portfolioNumber: String!, $type: PortfolioMovementTypeEnum!) {
        portfolioMovements(
          first: $pageSize
          offset: $offset
          orderBy: CREATED_AT_DESC
          filter: {
            type: { equalTo: $type }
            or: [
              { fromId: { startsWith: $portfolioNumber } }
              { toId: { startsWith: $portfolioNumber } }
            ]
          }
        ) {
          totalCount
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          nodes {
            id
            fromId
            from {
              identityId
              number
              name
            }
            toId
            to {
              identityId
              number
              name
            }
            assetId
            ${assetDetail}
            address
            memo
            createdBlock {
              blockId
              datetime
            }
          }
        }
      }
    `;

    const variables = {
      pageSize,
      offset,
      portfolioNumber,
      type,
    };

    const response = await this.client.request<PortfolioMovementsResponse>(
      query,
      variables,
    );
    const { portfolioMovements } = response;

    return {
      movements: portfolioMovements.nodes.map(
        portfolioMovementNodeToPortfolioMovement,
      ),
      totalCount: portfolioMovements.totalCount,
      hasNextPage: portfolioMovements.pageInfo.hasNextPage,
      hasPreviousPage: portfolioMovements.pageInfo.hasPreviousPage,
      startCursor: portfolioMovements.pageInfo.startCursor,
      endCursor: portfolioMovements.pageInfo.endCursor,
    };
  }
}
