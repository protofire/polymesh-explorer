import { GraphQLClient, gql } from 'graphql-request';
import { AssetTransaction } from '@/domain/entities/AssetTransaction';
import { AssetTransactionsResponse, PageInfo } from './types';
import { pageInfoFragment } from './fragments';
import { assetTransactionNodeToAssetTransaction } from '@/services/repositories/nodeTransformers';

export class AssetTransactionGraphRepo {
  constructor(private client: GraphQLClient) {}

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
