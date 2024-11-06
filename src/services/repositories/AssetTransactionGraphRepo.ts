import { GraphQLClient, gql } from 'graphql-request';
import { AssetTransaction } from '@/domain/entities/AssetTransaction';
import { AssetTransactionsResponse, PageInfo } from './types';
import { pageInfoFragment } from './fragments';
import { assetTransactionNodeToAssetTransaction } from '@/services/repositories/nodeTransformers';

type FilterType = {
  portfolioId?: string;
  assetId?: string;
};

export class AssetTransactionGraphRepo {
  constructor(private client: GraphQLClient) {}

  private static buildFilter(filter: FilterType, nonFungible: boolean) {
    if (filter.portfolioId) {
      return `
        or: [
          {fromPortfolioId: {equalTo: "${filter.portfolioId}"}}
          {toPortfolioId: {equalTo: "${filter.portfolioId}"}}
        ]
        amount: {
          isNull: ${nonFungible}
        }
      `;
    }

    if (filter.assetId) {
      return `
        assetId: {equalTo: "${filter.assetId}"}
        amount: {
          isNull: ${nonFungible}
        }
      `;
    }

    throw new Error('Must provide portfolioId or assetId');
  }

  async getAssetTransactions(
    filter: FilterType,
    pageSize: number,
    after?: string,
    nonFungible: boolean = false,
  ): Promise<{
    transactions: AssetTransaction[];
    totalCount: number;
    pageInfo: PageInfo;
  }> {
    const filterConditions = AssetTransactionGraphRepo.buildFilter(
      filter,
      nonFungible,
    );

    const query = gql`
      ${pageInfoFragment}
      query ($pageSize: Int!, $after: Cursor) {
        assetTransactions(
          first: $pageSize
          after: $after
          orderBy: CREATED_AT_DESC
          filter: {
            ${filterConditions}
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
            fundingRound
            instructionId
            instructionMemo
    		instruction {
				venueId
			}
          }
        }
      }
    `;

    const variables = {
      pageSize,
      after,
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
