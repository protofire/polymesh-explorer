import { GraphQLClient, gql } from 'graphql-request';
import { Identity } from '@/domain/entities/Identity';
import { SearchCriteria } from '../../domain/criteria/SearchCriteria';

interface IdentityNode {
  did: string;
  primaryAccount: string;
  secondaryAccounts: string[];
  createdAt: string;
  lastModifiedAt: string;
  // Añade aquí cualquier otro campo que esté disponible en el nodo de identidad
}

interface IdentityResponse {
  identities: {
    nodes: IdentityNode[];
  };
}

export class GraphIdentityRepo {
  constructor(private client: GraphQLClient) {}

  async findByIdentifier(criteria: SearchCriteria): Promise<Identity | null> {
    const query = gql`
      query ($filter: IdentityFilter!) {
        identities(filter: $filter, first: 1) {
          nodes {
            did
            primaryAccount
            createdAt
            secondaryAccounts {
              totalCount
              nodes {
                address
              }
            }
          }
        }
      }
    `;

    const variables = {
      filter: { did: { equalTo: criteria.searchTerm } },
    };

    const response = await this.client.request<IdentityResponse>(
      query,
      variables,
    );
    const identities = response.identities.nodes;

    return identities.length > 0 ? identities[0] : null;
  }
}
