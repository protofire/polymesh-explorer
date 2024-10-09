import { GraphQLClient, gql } from 'graphql-request';

interface Extrinsic {
  blockId: string;
  extrinsicIdx: number;
  address: string;
  nonce: number;
  moduleId: string;
  callId: string;
  paramsTxt: string;
  success: boolean;
  specVersionId: number;
  extrinsicHash: string;
  block: {
    hash: string;
    datetime: string;
  };
}

interface ExtrinsicResponse {
  totalCount: number;
  nodes: Extrinsic[];
}

export class ExtrinsicGraphRepo {
  constructor(private client: GraphQLClient) {}

  async getTransactionsByDid(
    didTransactions: Record<string, string[]>,
    start: number = 0,
    size: number = 10,
  ): Promise<Record<string, { extrinsics: Extrinsic[]; totalCount: number }>> {
    const queries = Object.entries(didTransactions).map(([did, addresses]) => {
      const addressFilter = addresses
        .map((address) => `"${address}"`)
        .join(', ');
      return `
        did_${did}: extrinsics(
          filter: {address: {in: [${addressFilter}]}}
          orderBy: [CREATED_AT_DESC]
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
      { extrinsics: Extrinsic[]; totalCount: number }
    > = {};
    Object.entries(response).forEach(([key, value]) => {
      const did = Object.keys(didTransactions).find(
        (d) => d === key.substring(4),
      );
      if (did) {
        result[did] = {
          extrinsics: value.nodes,
          totalCount: value.totalCount,
        };
      }
    });

    return result;
  }

  async getTransactionsByAddress(
    address: string,
    start: number = 0,
    size: number = 10,
  ): Promise<{ extrinsics: Extrinsic[]; totalCount: number }> {
    const query = gql`
      query TransactionsQuery($start: Int, $size: Int, $address: String!) {
        extrinsics(
          filter: { address: { equalTo: $address } }
          orderBy: [CREATED_AT_DESC]
          first: $size
          offset: $start
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
      }
    `;

    const variables = {
      start,
      size,
      address,
    };

    const response = await this.client.request<{
      extrinsics: ExtrinsicResponse;
    }>(query, variables);

    return {
      extrinsics: response.extrinsics.nodes,
      totalCount: response.extrinsics.totalCount,
    };
  }
}
