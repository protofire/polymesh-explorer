import { GraphQLClient, gql } from 'graphql-request';
import { PortfolioMovementTypeEnum } from '@polymeshassociation/polymesh-sdk/middleware/types';
import { PortfolioMovement } from '@/domain/entities/PortfolioMovement';
import {
  assetTransactionNodeToAssetTransaction,
  portfolioMovementNodeToPortfolioMovement,
} from '@/services/repositories/nodeTransformers';
import {
  PortfolioMovementsResponse,
  AssetTransactionsResponse,
  PageInfo,
} from './types';
import { AssetTransaction } from '@/domain/entities/AssetTransaction';
import { pageInfoFragment } from './fragments';

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
            ...PageInfoFields
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

  async getAssetTransactions(
    portfolioId: string,
    pageSize: number,
    nonFungible: boolean = false,
    offset: number = 0,
  ): Promise<{
    transactions: AssetTransaction[];
    totalCount: number;
    pageInfo: PageInfo;
  }> {
    const query = gql`
      ${pageInfoFragment}
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
            ...PageInfoFields
          }
          nodes {
            amount
            assetId
            asset {
              ticker
            }
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
        assetTransactionNodeToAssetTransaction,
      ),
      totalCount: assetTransactions.totalCount,
      pageInfo: assetTransactions.pageInfo,
    };
  }
}
