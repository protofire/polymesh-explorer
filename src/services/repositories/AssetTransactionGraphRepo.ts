import { GraphQLClient, gql } from 'graphql-request';
import { AssetTransaction } from '@/domain/entities/AssetTransaction';
import { assetTransactionNodeToAssetTransaction } from '@/services/repositories/nodeTransformers';
import { pageInfoFragment } from './fragments';
import { AssetTransactionsResponse, PageInfo } from './types';

type FilterType = {
  portfolioId?: string;
  assetId?: string;
  account?: string;
};

type BuiltFilter = {
  filterConditions: string;
  variableDeclarations: string;
  variables: Record<string, string | boolean>;
};

export class AssetTransactionGraphRepo {
  constructor(private client: GraphQLClient) {}

  private static buildFilter(
    filter: FilterType,
    nonFungible: boolean,
  ): BuiltFilter {
    const amountFilter = `
        amount: {
          isNull: $nonFungible
        }
    `;

    if (filter.portfolioId) {
      return {
        filterConditions: `
        or: [
          {fromPortfolioId: {equalTo: $filterId}}
          {toPortfolioId: {equalTo: $filterId}}
        ]
        ${amountFilter}
      `,
        variableDeclarations: '$filterId: String!',
        variables: { filterId: filter.portfolioId, nonFungible },
      };
    }

    if (filter.account) {
      return {
        filterConditions: `
        or: [
          {fromAccount: {equalTo: $filterId}}
          {toAccount: {equalTo: $filterId}}
        ]
        ${amountFilter}
      `,
        variableDeclarations: '$filterId: String!',
        variables: { filterId: filter.account, nonFungible },
      };
    }

    if (filter.assetId) {
      return {
        filterConditions: `
        assetId: {equalTo: $filterId}
        ${amountFilter}
      `,
        variableDeclarations: '$filterId: String!',
        variables: { filterId: filter.assetId, nonFungible },
      };
    }

    throw new Error('Must provide portfolioId, account, or assetId');
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
    const { filterConditions, variableDeclarations, variables } =
      AssetTransactionGraphRepo.buildFilter(filter, nonFungible);

    const query = gql`
      ${pageInfoFragment}
      query ($pageSize: Int!, $after: Cursor, $nonFungible: Boolean!, ${variableDeclarations}) {
        assetTransactions(
          first: $pageSize
          after: $after
          orderBy: CREATED_EVENT_ID_DESC
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
            toAccount
            toIdentityId
            toPortfolioId
            toPortfolio {
              identityId
              number
              name
            }
            fromAccount
            fromIdentityId
            fromPortfolioId
            fromPortfolio {
              identityId
              number
              name
            }
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

    const response = await this.client.request<AssetTransactionsResponse>(
      query,
      {
        pageSize,
        after,
        ...variables,
      },
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
