import { gql } from 'graphql-request';

export const assetFragment = gql`
  fragment AssetFields on Asset {
    id
    ticker
    name
    type
    totalSupply
    isNftCollection
    isDivisible
    owner {
      did
    }
    documents {
      totalCount
    }
    holders {
      totalCount
    }
    nftHolders {
      totalCount
    }
    createdBlock {
      blockId
      datetime
      hash
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
    createdBlock {
      createdAt
    }
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

export const pageInfoFragment = gql`
  fragment PageInfoFields on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`;
