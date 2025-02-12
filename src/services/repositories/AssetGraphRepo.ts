import { GraphQLClient, gql } from 'graphql-request';
import { Asset } from '@/domain/entities/Asset';
import { assetNodeToAsset } from '@/services/repositories/nodeTransformers';
import { assetFragment, pageInfoFragment } from './fragments';
import { AssetListResponse, AssetResponse, PageInfo } from './types';
import { AssetCriteria } from '@/domain/criteria/AssetCriteria';

interface Params {
  first: number;
  after?: string;
  isNftCollection?: boolean;
}

export class AssetGraphRepo {
  constructor(private client: GraphQLClient) {}

  async findByAssetId(assetId: string): Promise<Asset | null> {
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
      filter: { id: { equalTo: assetId } },
    };

    const response = await this.client.request<AssetResponse>(query, variables);
    const assets = response.assets.nodes;

    if (assets.length === 0) return null;

    return assetNodeToAsset(assets[0]);
  }

  async getAssetList(criteria: AssetCriteria): Promise<{
    assets: Asset[];
    totalCount: number;
    pageInfo: PageInfo;
  }> {
    const params: Params = {
      first: criteria.pageSize,
      after: criteria.cursor,
    };

    if (criteria.assetType !== 'All' && criteria.assetType !== undefined) {
      params.isNftCollection = criteria.assetType === 'NonFungible';
    }

    const queryWithFilter = gql`
      ${assetFragment}
      ${pageInfoFragment}
      query ($first: Int!, $after: Cursor, $isNftCollection: Boolean!) {
        assets(
          first: $first
          after: $after
          orderBy: [CREATED_EVENT_ID_DESC]
          filter: { isNftCollection: { equalTo: $isNftCollection } }
        ) {
          totalCount
          pageInfo {
            ...PageInfoFields
          }
          nodes {
            ...AssetFields
          }
        }
      }
    `;

    const queryWithoutFilter = gql`
      ${assetFragment}
      ${pageInfoFragment}
      query ($first: Int!, $after: Cursor) {
        assets(first: $first, after: $after, orderBy: [CREATED_EVENT_ID_DESC]) {
          totalCount
          pageInfo {
            ...PageInfoFields
          }
          nodes {
            ...AssetFields
          }
        }
      }
    `;

    const query =
      params.isNftCollection !== undefined
        ? queryWithFilter
        : queryWithoutFilter;

    const response = await this.client.request<AssetListResponse>(
      query,
      params,
    );
    const { assets } = response;

    return {
      assets: assets.nodes.map(assetNodeToAsset),
      totalCount: assets.totalCount,
      pageInfo: assets.pageInfo,
    };
  }

  async getAssetsListIds(assetIds: string[]): Promise<Record<string, Asset>> {
    const query = gql`
      ${assetFragment}
      query GetAssetDetails($assetIds: [String!]!) {
        assets(filter: { id: { in: $assetIds } }) {
          nodes {
            ...AssetFields
          }
        }
      }
    `;

    const response = await this.client.request<AssetListResponse>(query, {
      assetIds,
    });

    return response.assets.nodes.reduce(
      (acc, node) => ({
        ...acc,
        [node.id]: assetNodeToAsset(node),
      }),
      {},
    );
  }
}
