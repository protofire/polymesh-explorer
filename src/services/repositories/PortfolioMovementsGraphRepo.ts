import { PortfolioMovementTypeEnum } from '@polymeshassociation/polymesh-sdk/middleware/types';
import { GraphQLClient, gql } from 'graphql-request';
import { PortfolioMovement } from '@/domain/entities/PortfolioMovement';
import { portfolioMovementNodeToPortfolioMovement } from '@/services/repositories/nodeTransformers';
import { pageInfoFragment } from './fragments';
import { PageInfo, PortfolioMovementsResponse } from './types';

export type PortfolioMovementType = PortfolioMovementTypeEnum;

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
    pageInfo: PageInfo;
  }> {
    const assetDetail = type === 'Fungible' ? 'amount' : 'nftIds';

    const query = gql`
      ${pageInfoFragment}
      query ($pageSize: Int!, $offset: Int!, $portfolioNumber: String!, $type: PortfolioMovementTypeEnum!) {
        portfolioMovements(
          first: $pageSize
          offset: $offset
          orderBy: ID_DESC
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
            ...PageInfoFields
          }
          nodes {
            id
            fromAccount
            fromId
            from {
              identityId
              number
              name
            }
            toAccount
            toId
            to {
              identityId
              number
              name
            }
            assetId
            asset {
              ticker
            }
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
      pageInfo: portfolioMovements.pageInfo,
    };
  }
}
