import { Asset } from '@/domain/entities/Asset';
import { AssetNode, IdentityNode } from './types';
import { Identity } from '@/domain/entities/Identity';

export function transformAssetNodeToAsset(assetNode: AssetNode): Asset {
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

export function transformToIdentity(node: IdentityNode): Identity {
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
      transformAssetNodeToAsset(asset),
    ),
    heldAssets: node.heldAssets.nodes.map((heldAsset) =>
      transformAssetNodeToAsset(heldAsset.asset),
    ),
  };
}
