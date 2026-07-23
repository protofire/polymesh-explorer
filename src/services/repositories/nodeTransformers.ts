import { Balance } from '@polkadot/types/interfaces';
import { balanceToBigNumber } from '@polymeshassociation/polymesh-sdk/utils/conversion';
import { Asset } from '@/domain/entities/Asset';
import { AssetHolder } from '@/domain/entities/AssetHolder';
import { AssetTransaction } from '@/domain/entities/AssetTransaction';
import { ExtrinsicTransaction } from '@/domain/entities/ExtrinsicTransaction';
import { Identity } from '@/domain/entities/Identity';
import { Portfolio } from '@/domain/entities/Portfolio';
import { PortfolioMovement } from '@/domain/entities/PortfolioMovement';
import { Venue } from '@/domain/entities/Venue';
import { hexToUuid } from '../polymesh/hexToUuid';
import {
  AssetHolderNode,
  AssetNode,
  AssetTransactionNode,
  ExtrinsicNode,
  IdentityNode,
  PortfolioMovementNode,
  RawPortfolio,
  VenueNode,
} from './types';

export function assetNodeToAsset({
  asset,
  heldAmount,
  heldNftIds,
}: {
  asset: AssetNode;
  heldAmount?: string;
  heldNftIds?: number[];
}): Asset {
  return {
    assetId: asset.id,
    assetUuid: hexToUuid(asset.id),
    ticker: asset.ticker,
    name: asset.name,
    type: asset.type,
    totalSupply:
      !asset.isNftCollection && asset.totalSupply
        ? balanceToBigNumber(asset.totalSupply as unknown as Balance).toString()
        : asset.totalSupply,
    ownerDid: asset.owner.did,
    isNftCollection: asset.isNftCollection,
    isDivisible: asset.isDivisible,
    totalHolders: asset.isNftCollection
      ? asset.nftHolders.totalCount.toString()
      : asset.holders.totalCount.toString(),
    createdAt: new Date(`${asset.createdBlock.datetime}Z`),
    totalDocuments: asset.documents.totalCount.toString(),
    heldAmount: heldAmount
      ? balanceToBigNumber(heldAmount as unknown as Balance).toString()
      : undefined,
    heldNftIds,
  };
}

export function identityNodeToIdentity(node: IdentityNode): Identity {
  return {
    did: node.did,
    primaryAccount: node.primaryAccount,
    secondaryAccounts: node.secondaryAccounts.nodes
      .filter((account) => account.address !== node.primaryAccount)
      .map((account) => account.address),
    createdAt: new Date(`${node.createdBlock.datetime}Z`),
    claimsCount: node.claimsByTargetId.totalCount,
    assetsCount: node.heldAssets.totalCount + node.heldNfts.totalCount,
    venuesCount: node.venuesByOwnerId.totalCount,
    portfoliosCount: node.portfolios.totalCount,
    ownedAssets: node.assetsByOwnerId.nodes.map((asset) =>
      assetNodeToAsset({ asset }),
    ),
    heldAssets: node.heldAssets.nodes
      .map((heldAsset) =>
        assetNodeToAsset({
          asset: heldAsset.asset,
          heldAmount: heldAsset.amount,
        }),
      )
      .concat(
        node.heldNfts.nodes.map((nft) =>
          assetNodeToAsset({ asset: nft.asset, heldNftIds: nft.nftIds }),
        ),
      ),
    isCustodian: node.portfoliosByCustodianId.totalCount > 0,
    custodiedPortfoliosCount: node.portfoliosByCustodianId.totalCount,
  };
}

export function venueNodeToVenue(node: VenueNode): Venue {
  return {
    id: node.id,
    details: node.details,
    type: node.type,
    ownerId: node.ownerId,
    createdAt: new Date(`${node.createdBlock.datetime}Z`),
  };
}

export const getPortfolioParty = (party: RawPortfolio): Portfolio => ({
  id: party.identityId,
  number: party.number,
  name: (party.number as unknown as number) === 0 ? 'Default' : party.name,
});

export function portfolioMovementNodeToPortfolioMovement(
  node: PortfolioMovementNode,
): PortfolioMovement {
  return {
    id: node.id,
    from: node.from ? getPortfolioParty(node.from) : undefined,
    fromAccount: node.fromAccount || undefined,
    to: node.to ? getPortfolioParty(node.to) : undefined,
    toAccount: node.toAccount || undefined,
    assetId: node.assetId,
    assetTicker: node.asset?.ticker,
    amount:
      node.amount &&
      balanceToBigNumber(node.amount as unknown as Balance).toString(),
    nftIds: node.nftIds,
    address: node.address,
    memo: node.memo,
    createdAt: new Date(`${node.createdBlock.datetime}Z`),
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
    fromAccount: node.fromAccount || undefined,
    fromIdentityId: node.fromIdentityId || undefined,
    fromId: node.fromPortfolioId || undefined,
    from: node.fromPortfolio
      ? getPortfolioParty(node.fromPortfolio)
      : undefined,
    toAccount: node.toAccount || undefined,
    toIdentityId: node.toIdentityId || undefined,
    toId: node.toPortfolioId || undefined,
    to: node.toPortfolio ? getPortfolioParty(node.toPortfolio) : undefined,
    amount:
      (node.amount &&
        balanceToBigNumber(node.amount as unknown as Balance).toString()) ||
      undefined,
    nftIds: node.nftIds || undefined,
    createdBlock: {
      blockId: node.createdBlockId,
      datetime: new Date(`${node.datetime}Z`),
    },
    extrinsicIdx: node.extrinsicIdx,
    eventIdx: node.eventIdx,
    eventId: node.eventId,
    instructionId: node.instructionId || undefined,
    venueId: node.instruction?.venueId || undefined,
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
      datetime: new Date(`${node.block.datetime}Z`),
    },
  };
}

export function assetHolderNodeToAssetHolder(
  node: AssetHolderNode,
): AssetHolder {
  return {
    identityDid: node.identityId,
    balance:
      node.amount &&
      balanceToBigNumber(node.amount as unknown as Balance).toString(),
  };
}
