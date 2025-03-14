import { GraphQLClient, gql } from 'graphql-request';
import { pageInfoFragment } from './fragments';
import { AssetHoldersResponse, NftHoldersResponse, PageInfo } from './types';
import { AssetHolder } from '@/domain/entities/AssetHolder';
import { assetHolderNodeToAssetHolder } from './nodeTransformers';

export class AssetHoldersGraphRepo {
  constructor(private client: GraphQLClient) {}

  async getAssetHolders(
    assetId: string,
    first: number,
    offset: number = 0,
  ): Promise<{
    holders: AssetHolder[];
    totalCount: number;
    pageInfo: PageInfo;
  }> {
    const query = gql`
      ${pageInfoFragment}
      query AssetHolders($first: Int!, $offset: Int!, $assetId: String!) {
        assetHolders(
          first: $first
          offset: $offset
          orderBy: AMOUNT_DESC
          filter: { assetId: { equalTo: $assetId } }
        ) {
          totalCount
          pageInfo {
            ...PageInfoFields
          }
          nodes {
            identityId
            amount
            assetId
          }
        }
      }
    `;

    const response = await this.client.request<AssetHoldersResponse>(query, {
      first,
      offset,
      assetId,
    });

    return {
      holders: response.assetHolders.nodes.map(assetHolderNodeToAssetHolder),
      totalCount: response.assetHolders.totalCount,
      pageInfo: response.assetHolders.pageInfo,
    };
  }

  async getNftHolders(
    assetId: string,
    first: number,
    offset: number = 0,
  ): Promise<{
    holders: AssetHolder[];
    totalCount: number;
    pageInfo: PageInfo;
  }> {
    const query = gql`
      ${pageInfoFragment}
      query NftHolders($first: Int!, $offset: Int!, $assetId: String!) {
        nftHolders(
          first: $first
          offset: $offset
          orderBy: NFT_IDS_DESC
          filter: { assetId: { equalTo: $assetId }, nftIds: { notEqualTo: [] } }
        ) {
          totalCount
          pageInfo {
            ...PageInfoFields
          }
          nodes {
            identityId
            assetId
            nftIds
          }
        }
      }
    `;

    const response = await this.client.request<NftHoldersResponse>(query, {
      first,
      offset,
      assetId,
    });

    return {
      holders: response.nftHolders.nodes.map((node) => ({
        identityDid: node.identityId,
        balance: node.nftIds.length.toString(),
        nftIds: node.nftIds,
      })),
      totalCount: response.nftHolders.totalCount,
      pageInfo: response.nftHolders.pageInfo,
    };
  }
}
