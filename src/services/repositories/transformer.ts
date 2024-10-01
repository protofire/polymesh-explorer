import { Asset } from '@/domain/entities/Asset';
import { AssetNode } from './AssetGraphRepo';

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
