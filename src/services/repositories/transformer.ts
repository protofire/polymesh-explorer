import { balanceToBigNumber } from '@polymeshassociation/polymesh-sdk/utils/conversion';
import { Balance } from '@polkadot/types/interfaces';
import { Asset } from '@/domain/entities/Asset';
import {
  AssetNode,
  AssetTransactionNode,
  IdentityNode,
  PortfolioMovementNode,
  VenueNode,
  ExtrinsicNode,
} from './types';
import { Identity } from '@/domain/entities/Identity';
import { Venue } from '@/domain/entities/Venue';
import { PortfolioMovement } from '@/domain/entities/PortfolioMovement';
import { Portfolio } from '@/domain/entities/Portfolio';
import { AssetTransaction } from '@/domain/entities/AssetTransaction';
import { ExtrinsicTransaction } from '@/domain/entities/ExtrinsicTransaction';

export function assetNodeToAsset(assetNode: AssetNode): Asset {
  return {
    ticker: assetNode.ticker,
    name: assetNode.name,
    type: assetNode.type,
    totalSupply:
      assetNode.totalSupply &&
      balanceToBigNumber(
        assetNode.totalSupply as unknown as Balance,
      ).toString(),
    ownerDid: assetNode.owner.did,
    isNftCollection: assetNode.isNftCollection,
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
    isCustodian: node.portfoliosByCustodianId.totalCount > 0,
    custodiedPortfoliosCount: node.portfoliosByCustodianId.totalCount,
    isChildIdentity: node.parentChildIdentities.totalCount > 0,
    parentIdentityDid: node.parentChildIdentities.nodes[0]?.parentId,
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
  const getPortfolioParty = (party: Portfolio): Portfolio => ({
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
    assetTicker: node.asset.ticker,
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

export function assetTransactionNodeToAssetTransaction(
  node: AssetTransactionNode,
): AssetTransaction {
  return {
    id: node.id,
    assetId: node.assetId,
    assetTicker: node.asset.ticker,
    fromId: node.fromPortfolioId,
    toId: node.toPortfolioId,
    amount:
      node.amount &&
      balanceToBigNumber(node.amount as unknown as Balance).toString(),
    nftIds: node.nftIds || undefined,
    createdBlock: {
      blockId: node.createdBlockId,
      datetime: new Date(node.datetime),
    },
    extrinsicIdx: node.extrinsicIdx,
    eventIdx: node.eventIdx,
    eventId: node.eventId,
    instructionId: node.instructionId || undefined,
    memo: node.instructionMemo || undefined,
  };
}

export function extrinsicNodeToExtrinsicTransaction(
  node: ExtrinsicNode,
): ExtrinsicTransaction {
  return {
    blockId: node.blockId,
    extrinsicIdx: node.extrinsicIdx,
    address: node.address,
    nonce: node.nonce,
    moduleId: node.moduleId,
    callId: node.callId,
    paramsTxt: node.paramsTxt,
    success: node.success,
    specVersionId: node.specVersionId,
    extrinsicHash: node.extrinsicHash,
    block: {
      hash: node.block.hash,
      datetime: new Date(node.block.datetime),
    },
  };
}
