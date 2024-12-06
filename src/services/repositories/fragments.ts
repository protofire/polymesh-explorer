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
    nftHolders(filter: { nftIds: { notEqualTo: [] } }) {
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
    type
    createdBlock {
      blockId
      datetime
      hash
    }
  }
`;

export const identityFragment = gql`
  fragment IdentityFields on Identity {
    did
    primaryAccount
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
    children {
      nodes {
        id
      }
    }
    createdBlock {
      blockId
      datetime
      hash
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

export const settlementInstructionFragment = gql`
  fragment SettlementInstructionFields on Instruction {
    id
    status
    venue {
      id
      details
    }
    type
    endBlock
    endAfterBlock
    tradeDate
    valueDate
    legs {
      nodes {
        legIndex
        legType
        from
        fromPortfolio
        to
        toPortfolio
        assetId
        ticker
        amount
        nftIds
        addresses
      }
    }
    memo
    affirmations {
      nodes {
        identity
        isAutomaticallyAffirmed
        isMediator
        createdAt
        createdBlockId
        status
        portfolios
      }
    }
    mediators
    failureReason
    createdBlock {
      id
      blockId
      datetime
      hash
    }
    updatedBlock {
      id
      blockId
      hash
      datetime
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
`;
