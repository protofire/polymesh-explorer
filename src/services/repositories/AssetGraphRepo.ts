import { GraphQLClient, gql } from 'graphql-request';
import { Asset } from '@/domain/entities/Asset';
import { assetNodeToAsset } from './transformer';
import { assetFragment } from './fragments';
import { AssetListResponse, AssetResponse, PageInfo } from './types';

export class AssetGraphRepo {
  constructor(private client: GraphQLClient) {}

  async findByTicker(ticker: string): Promise<Asset | null> {
    const query = gql`
      ${assetFragment}
      query ($filter: AssetFilter!) {
        assets(filter: $filter, first: 1) {
          nodes {
            ...AssetFields
          }
        }
      }
    `;

    const variables = {
      filter: { ticker: { equalTo: ticker } },
    };

    const response = await this.client.request<AssetResponse>(query, variables);
    const assets = response.assets.nodes;

    if (assets.length === 0) return null;

    return assetNodeToAsset(assets[0]);
  }

  async getAssetList(
    first: number,
    after?: string,
  ): Promise<{
    assets: Asset[];
    totalCount: number;
    pageInfo: PageInfo;
  }> {
    const query = gql`
      ${assetFragment}
      query ($first: Int!, $after: Cursor) {
        assets(first: $first, after: $after, orderBy: CREATED_AT_DESC) {
          totalCount
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            ...AssetFields
          }
        }
      }
    `;

    const variables = {
      first,
      after,
    };

    const response = await this.client.request<AssetListResponse>(
      query,
      variables,
    );
    const { assets } = response;

    return {
      assets: assets.nodes.map(assetNodeToAsset),
      totalCount: assets.totalCount,
      pageInfo: assets.pageInfo,
    };
  }
}
