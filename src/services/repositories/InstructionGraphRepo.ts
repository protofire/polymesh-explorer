import { GraphQLClient, gql } from 'graphql-request';
import {
  InstructionListResponse,
  InstructionResponse,
  PageInfo,
  RawInstructionNode,
} from './types';

export class InstructionGraphRepo {
  constructor(private client: GraphQLClient) {}

  async findById(id: string): Promise<RawInstructionNode | null> {
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
            createdBlock {
              id
              datetime
              hash
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
    const instructions = response.instructions.nodes;

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
