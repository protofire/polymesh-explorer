import { GraphQLClient, gql } from 'graphql-request';
import { Asset } from '@/domain/entities/Asset';

interface AssetNode {
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

function transformAssetNodeToAsset(assetNode: AssetNode): Asset {
  return {
    ticker: assetNode.ticker,
    name: assetNode.name,
    type: assetNode.type,
    totalSupply: assetNode.totalSupply,
    ownerDid: assetNode.owner.did,
    holders: assetNode.holders.totalCount.toString(),
    createdAt: new Date(assetNode.createdAt),
    documents: assetNode.documents.totalCount.toString(),
  };
}

export class AssetGraphRepo {
  constructor(private client: GraphQLClient) {}

  async findByTicker(ticker: string): Promise<Asset | null> {
    const query = gql`
      query ($filter: AssetFilter!) {
        assets(filter: $filter, first: 1) {
          nodes {
            ticker
            name
            type
            totalSupply
            createdAt
            owner {
              did
            }
            documents {
              totalCount
            }
            holders {
              totalCount
            }
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
      query ($first: Int!, $after: Cursor) {
        assets(first: $first, after: $after, orderBy: CREATED_AT_DESC) {
          totalCount
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            ticker
            name
            type
            totalSupply
            owner {
              did
            }
            documents {
              totalCount
            }
            createdAt
            holders {
              totalCount
            }
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
