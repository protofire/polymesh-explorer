import { GraphQLClient, gql } from 'graphql-request';
import {
  InstructionListResponse,
  InstructionResponse,
  LegAssetResponse,
  PageInfo,
  RawInstructionNode,
} from './types';
import { rawInstructiontoSettlementInstruction } from '../transformers/instructionsTransformer';
import { SettlementInstructionWithAssets } from '@/domain/entities/SettlementInstruction';
import { pageInfoFragment, settlementInstructionFragment } from './fragments';

export class InstructionGraphRepo {
  constructor(private client: GraphQLClient) {}

  private async getAssetsDetails(instructions: RawInstructionNode[]) {
    const uniqueAssetIds = Array.from(
      new Set(
        instructions.flatMap(
          (instruction) => instruction.legs.groupedAggregates[0].keys,
        ),
      ),
    );

    const query = gql`
      query GetAssetDetails($assetIds: [String!]!) {
        assets(filter: { id: { in: $assetIds } }) {
          nodes {
            id
            ticker
            name
            isNftCollection
          }
        }
      }
    `;

    const response = await this.client.request<LegAssetResponse>(query, {
      assetIds: uniqueAssetIds,
    });

    return response.assets.nodes.reduce(
      (acc, node) => ({
        ...acc,
        [node.id]: node,
      }),
      {},
    );
  }

  async findById(id: string): Promise<SettlementInstructionWithAssets | null> {
    const query = gql`
      ${settlementInstructionFragment}
      query ($filter: InstructionFilter!) {
        instructions(filter: $filter, first: 1) {
          nodes {
            ...SettlementInstructionFields
          }
        }
      }
    `;

    const variables = {
      filter: { id: { equalTo: id } },
    };

    const response = await this.client.request<InstructionResponse>(
      query,
      variables,
    );
    const instructions = response.instructions.nodes.map(
      rawInstructiontoSettlementInstruction,
    );

    if (instructions.length === 0) return null;

    const assetsInvolved = await this.getAssetsDetails(
      response.instructions.nodes,
    );

    return { instructions, assetsInvolved };
  }

  async findByDid(
    did: string,
    pageSize: number,
    offset: number = 0,
    historicalInstructions: boolean = false,
  ): Promise<
    SettlementInstructionWithAssets & {
      totalCount: number;
      pageInfo: PageInfo;
    }
  > {
    const query = gql`
      ${pageInfoFragment}
      ${settlementInstructionFragment}
      query InstructionByDidQuery(
        $pageSize: Int!
        $offset: Int!
        $fromId: String!
        $toId: String!
      ) {
        instructions(
          first: $pageSize
          offset: $offset
          filter: {
            and: [
              {
                legs: {
                  some: {
                    or: [
                      { from: { startsWith: $fromId } }
                      { to: { startsWith: $toId } }
                    ]
                  }
                }
              }
              { status: { ${historicalInstructions ? 'distinctFrom' : 'equalTo'}: Created } }
            ]
          }
        ) {
          totalCount
          pageInfo {
            ...PageInfoFields
          }
          nodes {
            ...SettlementInstructionFields
          }
        }
      }
    `;

    const variables = {
      pageSize,
      offset,
      fromId: did,
      toId: did,
    };

    const response = await this.client.request<InstructionListResponse>(
      query,
      variables,
    );

    const assetsInvolved = await this.getAssetsDetails(
      response.instructions.nodes,
    );

    return {
      instructions: response.instructions.nodes.map(
        rawInstructiontoSettlementInstruction,
      ),
      assetsInvolved,
      totalCount: response.instructions.totalCount,
      pageInfo: response.instructions.pageInfo,
    };
  }

  async findByVenueId(
    venueId: string,
    pageSize: number,
    offset: number = 0,
    historicalInstructions: boolean = false,
  ): Promise<
    SettlementInstructionWithAssets & {
      totalCount: number;
      pageInfo: PageInfo;
    }
  > {
    const query = gql`
      ${pageInfoFragment}
      ${settlementInstructionFragment}
      query InstructionByVenueQuery(
        $pageSize: Int!
        $offset: Int!
        $venueId: String!
      ) {
        instructions(
          first: $pageSize
          offset: $offset
          filter: {
            and: [
              { venueId: { equalTo: $venueId } }
              { status: { ${historicalInstructions ? 'distinctFrom' : 'equalTo'}: Created } }
            ]
          }
        ) {
          totalCount
          pageInfo {
            ...PageInfoFields
          }
          nodes {
            ...SettlementInstructionFields
          }
        }
      }
    `;

    const variables = {
      pageSize,
      offset,
      venueId,
    };

    const response = await this.client.request<InstructionListResponse>(
      query,
      variables,
    );

    const assetsInvolved = await this.getAssetsDetails(
      response.instructions.nodes,
    );

    return {
      instructions: response.instructions.nodes.map(
        rawInstructiontoSettlementInstruction,
      ),
      assetsInvolved,
      totalCount: response.instructions.totalCount,
      pageInfo: response.instructions.pageInfo,
    };
  }
}
