import { GraphQLClient, gql } from 'graphql-request';

interface AssetNode {
  ticker: string;
  name: string;
  type: string;
  totalSupply: string;
  divisible: boolean;
  owner: {
    did: string;
  };
  documents: {
    totalCount: number;
  };
  assetHolders: {
    totalCount: number;
  };
}

interface AssetResponse {
  assets: {
    nodes: AssetNode[];
  };
}

interface AssetListNode {
  ticker: string;
  name: string;
  type: string;
  totalSupply: string;
  divisible: boolean;
  owner: {
    did: string;
  };
  documents: {
    totalCount: number;
  };
  assetHolders: {
    totalCount: number;
  };
  createdAt: string;
}

interface AssetListResponse {
  assets: {
    totalCount: number;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
    nodes: AssetListNode[];
  };
}

export class AssetGraphRepo {
  constructor(private client: GraphQLClient) {}

  async findByTicker(ticker: string): Promise<AssetNode | null> {
    const query = gql`
      query ($filter: AssetFilter!) {
        assets(filter: $filter, first: 1) {
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

    return assets[0];
  }

  async getAssetList(
    first: number,
    after?: string,
  ): Promise<{
    assets: AssetListNode[];
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
      assets: assets.nodes,
      totalCount: assets.totalCount,
      hasNextPage: assets.pageInfo.hasNextPage,
      endCursor: assets.pageInfo.endCursor,
    };
  }
}
