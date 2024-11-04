import { Identity } from '@/domain/entities/Identity';

export interface AssetFungibleHolder {
  identityDid: Identity['did'];
  balance: string;
  percentage?: string;
}

export interface AssetNonFungibleHolder {
  identityDid: Identity['did'];
  balance: string;
  nftIds: Array<string>;
  percentage?: string;
}

export type AssetHolder = AssetFungibleHolder | AssetNonFungibleHolder;

export function isAssetNonFungibleHolder(
  holder: AssetHolder,
): holder is AssetNonFungibleHolder {
  return (holder as AssetNonFungibleHolder).nftIds !== undefined;
}
