import { GraphQLClient, gql } from 'graphql-request';
import { ExtrinsicResponse, PageInfo } from './types';
import { pageInfoFragment } from './fragments';
import { extrinsicNodeToExtrinsicTransaction } from '@/services/repositories/nodeTransformers';
import { ExtrinsicTransaction } from '@/domain/entities/ExtrinsicTransaction';

export class ExtrinsicGraphRepo {
  constructor(private client: GraphQLClient) {}

  async getTransactionsByDidsAddresses(
    didTransactions: Record<string, string[]>,
    start: number = 0,
    size: number = 10,
  ): Promise<
    Record<string, { extrinsics: ExtrinsicTransaction[]; totalCount: number }>
  > {
    const queries = Object.entries(didTransactions).map(([did, addresses]) => {
      const addressFilter = addresses
        .map((address) => `"${address}"`)
        .join(', ');
      return `
        did_${did}: extrinsics(
          filter: {address: {in: [${addressFilter}]}}
          orderBy: [ID_DESC]
          first: ${size}
          offset: ${start}
        ) {
          totalCount
          nodes {
            blockId
            extrinsicIdx
            address
            nonce
            moduleId
            callId
            paramsTxt
            success
            specVersionId
            extrinsicHash
            block {
              hash
              datetime
            }
          }
        }
      `;
    });

    const query = gql`
      query TransactionsByDid {
        ${queries.join('\n')}
      }
    `;

    const response =
      await this.client.request<Record<string, ExtrinsicResponse>>(query);

    const result: Record<
      string,
      { extrinsics: ExtrinsicTransaction[]; totalCount: number }
    > = {};
    Object.entries(response).forEach(([key, value]) => {
      const did = Object.keys(didTransactions).find(
        (d) => d === key.substring(4), // Compare removing did_ on key
      );
      if (did) {
        result[did] = {
          extrinsics: value.nodes.map(extrinsicNodeToExtrinsicTransaction),
          totalCount: value.totalCount,
        };
      }
    });

    return result;
  }

  async getTransactionsByAddresses(
    addresses: string[],
    start: number = 0,
    size: number = 10,
  ): Promise<{
    extrinsics: ExtrinsicTransaction[];
    totalCount: number;
    pageInfo: PageInfo;
  }> {
    const query = gql`
      ${pageInfoFragment}
      query TransactionsQuery($start: Int, $size: Int, $addresses: [String!]!) {
        extrinsics(
          filter: { address: { in: $addresses } }
          orderBy: [ID_DESC]
          first: $size
          offset: $start
        ) {
          totalCount
          pageInfo {
            ...PageInfoFields
          }
          nodes {
            blockId
            extrinsicIdx
            address
            nonce
            moduleId
            callId
            paramsTxt
            success
            specVersionId
            extrinsicHash
            block {
              hash
              datetime
            }
          }
        }
      }
    `;

    const variables = {
      start,
      size,
      addresses,
    };

    const response = await this.client.request<{
      extrinsics: ExtrinsicResponse;
    }>(query, variables);

    return {
      extrinsics: response.extrinsics.nodes.map(
        extrinsicNodeToExtrinsicTransaction,
      ),
      totalCount: response.extrinsics.totalCount,
      pageInfo: response.extrinsics.pageInfo,
    };
  }
}
