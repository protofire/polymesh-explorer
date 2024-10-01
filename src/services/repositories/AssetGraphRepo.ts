import { GraphQLClient, gql } from 'graphql-request';
import { Asset } from '@/domain/entities/Asset';
import { transformAssetNodeToAsset } from './transformer';
import { assetFragment } from './fragments';

export interface AssetNode {
  ticker: string;
  name: string;
  type: string;
  totalSupply: string;
  divisible: boolean;
  createdAt: string;
  owner: {
    did: string;
  };
  documents: {
    totalCount: number;
  };
  holders: {
    totalCount: number;
  };
}

interface AssetResponse {
  assets: {
    nodes: AssetNode[];
  };
}

interface AssetListResponse {
  assets: {
    totalCount: number;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
    nodes: AssetNode[];
  };
}


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

    return transformAssetNodeToAsset(assets[0]);
  }

  async getAssetList(
    first: number,
    after?: string,
  ): Promise<{
    assets: Asset[];
    totalCount: number;
    hasNextPage: boolean;
    endCursor: string;
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
      assets: assets.nodes.map(transformAssetNodeToAsset),
      totalCount: assets.totalCount,
      hasNextPage: assets.pageInfo.hasNextPage,
      endCursor: assets.pageInfo.endCursor,
    };
  }
}
