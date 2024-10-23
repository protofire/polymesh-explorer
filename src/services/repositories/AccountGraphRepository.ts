import { GraphQLClient, gql } from 'graphql-request';
import { Account } from '@/domain/entities/Account';

interface AccountNode {
  address: string;
  identityId: string | null;
  createdAt: string;
  multiSigsByCreatorAccountId: {
    totalCount: number;
  };
  identity: {
    primaryAccount: string;
  } | null;
}

interface AccountResponse {
  accounts: {
    nodes: AccountNode[];
  };
}

export class AccountGraphRepository {
  constructor(private client: GraphQLClient) {}

  async findByKey(key: string): Promise<Account | null> {
    const query = gql`
      query ($filter: AccountFilter!) {
        accounts(filter: $filter, first: 1) {
          nodes {
            address
            identityId
            createdAt
            multiSigsByCreatorAccountId {
              totalCount
            }
            identity {
              primaryAccount
            }
          }
        }
      }
    `;

    const variables = {
      filter: { address: { equalTo: key } },
    };

    const response = await this.client.request<AccountResponse>(
      query,
      variables,
    );
    const accounts = response.accounts.nodes;

    if (accounts.length === 0) return null;

    const account = accounts[0];

    return {
      key: account.address,
      identityDid: account.identityId,
      isMultisig: account.multiSigsByCreatorAccountId.totalCount > 0,
      identityRelationship:
        account.identity?.primaryAccount === account.address
          ? 'Primary'
          : 'Secondary',
      isSmartContract: false,
    };
  }

  async existsByKey(key: string): Promise<boolean> {
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
      filter: { address: { equalTo: key } },
    };

    const response = await this.client.request<AccountResponse>(
      query,
      variables,
    );
    const accounts = response.accounts.nodes;

    return accounts.length > 0;
  }
}
