import { GraphQLClient, gql } from 'graphql-request';
import {
  InstructionListResponse,
  InstructionResponse,
  PageInfo,
  RawInstructionNode,
} from './types';
import { rawInstructiontoSettlementInstruction } from '../transformers/instructionsTransformer';
import { SettlementInstructionWithEvents } from '@/domain/entities/SettlementInstruction';

export class InstructionGraphRepo {
  constructor(private client: GraphQLClient) {}

  async findById(id: string): Promise<SettlementInstructionWithEvents | null> {
    const query = gql`
      query ($filter: InstructionFilter!) {
        instructions(filter: $filter, first: 1) {
          nodes {
            id
            status
            venue {
              id
              details
            }
            type
            endBlock
            endAfterBlock
            tradeDate
            valueDate
            legs {
              nodes {
                legIndex
                legType
                from
                fromPortfolio
                to
                toPortfolio
                assetId
                ticker
                amount
                nftIds
                addresses
              }
            }
            memo
            affirmations {
              nodes {
                identity
                isAutomaticallyAffirmed
                isMediator
                createdAt
                createdBlockId
                status
                portfolios
              }
            }
            mediators
            failureReason
            createdBlock {
              id
              blockId
              datetime
              hash
            }
            updatedBlock {
              id
              blockId
              hash
              datetime
            }
            events {
              nodes {
                id
                event
                createdBlock {
                  id
                  datetime
                  hash
                }
              }
            }
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

  async getInstructionList(
    first: number,
    after?: string,
  ): Promise<{
    instructions: RawInstructionNode[];
    totalCount: number;
    pageInfo: PageInfo;
  }> {
    const query = gql`
      query ($first: Int!, $after: Cursor) {
        instructions(first: $first, after: $after) {
          totalCount
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          nodes {
            id
            status
            venue {
              id
              details
            }
            createdBlock {
              id
              datetime
              hash
            }
          }
        }
      }
    `;

    const variables = {
      first,
      after,
    };

    const response = await this.client.request<InstructionListResponse>(
      query,
      variables,
    );
    const { instructions } = response;

    return {
      instructions: instructions.nodes,
      totalCount: instructions.totalCount,
      pageInfo: instructions.pageInfo,
    };
  }
}
