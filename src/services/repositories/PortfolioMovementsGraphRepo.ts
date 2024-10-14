import { GraphQLClient, gql } from 'graphql-request';
import { PortfolioMovement } from '@/domain/entities/PortfolioMovement';
import { portfolioMovementNodeToPortfolioMovement, assetTransactionNodeToPortfolioMovement } from './transformer';
import { PortfolioMovementsResponse, AssetTransactionsResponse } from './types';

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

  async getAssetTransactions(
    portfolioId: string,
    pageSize: number,
    offset: number = 0,
    nonFungible: boolean = false,
  ): Promise<{
    transactions: PortfolioMovement[];
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
  }> {
    const query = gql`
      query ($pageSize: Int!, $offset: Int!) {
        assetTransactions(
          first: $pageSize
          offset: $offset
          orderBy: CREATED_AT_DESC
          filter: {
            or: [
              {fromPortfolioId: {equalTo: "${portfolioId}"}}
              {toPortfolioId: {equalTo: "${portfolioId}"}}
            ]
            amount: {
              isNull: ${nonFungible}
            }
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
            amount
            assetId
            nftIds
            datetime
            id
            createdBlockId
            extrinsicIdx
            eventIdx
            eventId
            toPortfolioId
            fromPortfolioId
            instructionId
            instructionMemo
          }
        }
      }
    `;

    const variables = {
      pageSize,
      offset,
    };

    const response = await this.client.request<AssetTransactionsResponse>(
      query,
      variables,
    );
    const { assetTransactions } = response;

    return {
      transactions: assetTransactions.nodes.map(
        assetTransactionNodeToPortfolioMovement,
      ),
      totalCount: assetTransactions.totalCount,
      hasNextPage: assetTransactions.pageInfo.hasNextPage,
      hasPreviousPage: assetTransactions.pageInfo.hasPreviousPage,
      startCursor: assetTransactions.pageInfo.startCursor,
      endCursor: assetTransactions.pageInfo.endCursor,
    };
  }
}
