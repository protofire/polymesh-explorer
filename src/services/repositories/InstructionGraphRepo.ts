import { GraphQLClient, gql } from 'graphql-request';
import {
  InstructionListResponse,
  InstructionResponse,
  PageInfo,
} from './types';
import { rawInstructiontoSettlementInstruction } from '../transformers/instructionsTransformer';
import { SettlementInstructionWithEvents } from '@/domain/entities/SettlementInstruction';
import { pageInfoFragment, settlementInstructionFragment } from './fragments';

export class InstructionGraphRepo {
  constructor(private client: GraphQLClient) {}

  async findById(id: string): Promise<SettlementInstructionWithEvents | null> {
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

    return instructions[0];
  }

  async findByDid(
    did: string,
    pageSize: number,
    offset: number = 0,
    historicalInstructions: boolean = false,
  ): Promise<{
    instructions: SettlementInstructionWithEvents[];
    totalCount: number;
    pageInfo: PageInfo;
  }> {
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

    return {
      instructions: response.instructions.nodes.map(
        rawInstructiontoSettlementInstruction,
      ),
      totalCount: response.instructions.totalCount,
      pageInfo: response.instructions.pageInfo,
    };
  }
}
