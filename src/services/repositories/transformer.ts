import { balanceToBigNumber } from '@polymeshassociation/polymesh-sdk/utils/conversion';
import { Balance } from '@polkadot/types/interfaces';
import { Asset } from '@/domain/entities/Asset';
import {
  AssetNode,
  IdentityNode,
  PortfolioMovementNode,
  VenueNode,
} from './types';
import { Identity } from '@/domain/entities/Identity';
import { Venue } from '@/domain/entities/Venue';
import {
  PortfolioMovement,
  PortfolioParty,
} from '@/domain/entities/PortfolioMovement';

export function assetNodeToAsset(assetNode: AssetNode): Asset {
  return {
    ticker: assetNode.ticker,
    name: assetNode.name,
    type: assetNode.type,
    totalSupply: assetNode.totalSupply,
    ownerDid: assetNode.owner.did,
    holders: assetNode.holders.totalCount.toString(),
    createdAt: new Date(assetNode.createdAt),
    documents: assetNode.documents.totalCount.toString(),
  };
}

export function identityNodeToIdentity(node: IdentityNode): Identity {
  return {
    did: node.did,
    primaryAccount: node.primaryAccount,
    secondaryAccounts: node.secondaryAccounts.nodes
      .filter((account) => account.address !== node.primaryAccount)
      .map((account) => account.address),
    createdAt: new Date(node.createdAt),
    claimsCount: node.claimsByTargetId.totalCount,
    assetsCount: node.heldAssets.totalCount,
    venuesCount: node.venuesByOwnerId.totalCount,
    portfoliosCount: node.portfolios.totalCount,
    ownedAssets: node.assetsByOwnerId.nodes.map((asset) =>
      assetNodeToAsset(asset),
    ),
    heldAssets: node.heldAssets.nodes.map((heldAsset) =>
      assetNodeToAsset(heldAsset.asset),
    ),
  };
}

export function venueNodeToVenue(node: VenueNode): Venue {
  return {
    id: node.id,
    details: node.details,
    type: node.type,
    ownerId: node.ownerId,
    createdAt: new Date(node.createdAt),
  };
}

export function portfolioMovementNodeToPortfolioMovement(
  node: PortfolioMovementNode,
): PortfolioMovement {
  const getPortfolioParty = (party: PortfolioParty): PortfolioParty => ({
    ...party,
    name: (party.number as unknown as number) === 0 ? 'Default' : party.name,
  });

  return {
    id: node.id,
    fromId: node.fromId,
    from: getPortfolioParty(node.from),
    toId: node.toId,
    to: getPortfolioParty(node.to),
    assetId: node.assetId,
    amount:
      node.amount &&
      balanceToBigNumber(node.amount as unknown as Balance).toString(),
    nftIds: node.nftIds,
    address: node.address,
    memo: node.memo,
    createdAt: node.createdBlock.datetime,
    blockId: node.createdBlock.blockId,
  };
}
