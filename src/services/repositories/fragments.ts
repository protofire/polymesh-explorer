import { gql } from 'graphql-request';

export const assetFragment = gql`
  fragment AssetFields on Asset {
    ticker
    name
    type
    totalSupply
    createdAt
    isNftCollection
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
    nodeId
    details
    type
    ownerId
    createdAt
    type
  }
`;

export const identityFragment = gql`
  fragment IdentityFields on Identity {
    did
    primaryAccount
    createdAt
    secondaryAccounts {
      totalCount
      nodes {
        address
      }
    }
    claimsByTargetId {
      totalCount
    }
    venuesByOwnerId {
      totalCount
    }
    portfolios(filter: { deletedAt: { isNull: true } }) {
      totalCount
    }
    heldAssets {
      totalCount
      nodes {
        asset {
          ...AssetFields
        }
      }
    }
    assetsByOwnerId {
      totalCount
      nodes {
        ...AssetFields
      }
    }
    heldNfts {
      totalCount
      nodes {
        asset {
          ...AssetFields
        }
      }
    }
    portfoliosByCustodianId {
      totalCount
      nodes {
        id
      }
    }
    parentChildIdentities {
      totalCount
      nodes {
        parentId
      }
    }
  }
  ${assetFragment}
`;
