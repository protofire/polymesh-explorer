import { gql } from 'graphql-request';

export const assetFragment = gql`
  fragment AssetFields on Asset {
    ticker
    name
    type
    totalSupply
    createdAt
    owner {
      did
    }
    documents {
      totalCount
    }
    holders {
      totalCount
    }
  }
`;
