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

export const venueFragment = gql`
  fragment VenueFields on Venue {
    id
    name
    description
    type
    ownerId
    createdAt
    updatedAt
  }
`;
