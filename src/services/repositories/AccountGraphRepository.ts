import { GraphQLClient, gql } from 'graphql-request';
import { Account } from '@/domain/entities/Account';

interface AccountNode {
  address: string;
  identityId: string | null;
  createdAt: string;
  identity: {
    did: string;
  } | null;
}

interface AccountResponse {
  accounts: {
    nodes: AccountNode[];
  };
}

export class AccountGraphRepository {
  constructor(private client: GraphQLClient) {}

  async findByAddress(address: string): Promise<Account | null> {
    const query = gql`
      query ($filter: AccountFilter!) {
        accounts(filter: $filter, first: 1) {
          nodes {
            address
            identityId
            createdAt
            identity {
              did
            }
          }
        }
      }
    `;

    const variables = {
      filter: { address: { equalTo: address } },
    };

    const response = await this.client.request<AccountResponse>(
      query,
      variables,
    );
    const accounts = response.accounts.nodes;

    if (accounts.length === 0) return null;

    const account = accounts[0];

    debugger

    return {
      key: account.address,
      identityId: account.identityId,
      createdAt: account.createdAt,
      did: account.identity?.did || null,
    };
  }

  async existsByAddress(address: string): Promise<boolean> {
    const query = gql`
      query ($filter: AccountFilter!) {
        accounts(filter: $filter, first: 1) {
          nodes {
            address
          }
        }
      }
    `;

    const variables = {
      filter: { address: { equalTo: address } },
    };

    const response = await this.client.request<AccountResponse>(
      query,
      variables,
    );
    const accounts = response.accounts.nodes;

    return accounts.length > 0;
  }
}
