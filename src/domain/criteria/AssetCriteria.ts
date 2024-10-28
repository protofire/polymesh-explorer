import { CriteriaBuilder } from './CriteriaBuilder';

export type AssetTokenType = 'All' | 'Fungible' | 'NonFungible';

export interface AssetFilters extends Record<string, unknown> {
  assetType: AssetTokenType;
}

export interface AssetCriteria {
  assetType?: AssetTokenType;
  pageSize: number;
  cursor?: string;
}

export class AssetCriteriaBuilder implements CriteriaBuilder<AssetCriteria> {
  private criteria: AssetCriteria = {
    pageSize: 10,
  };

  withAssetType(assetType: AssetTokenType): this {
    this.criteria.assetType = assetType;
    return this;
  }

  withPageSize(pageSize: number): this {
    this.criteria.pageSize = pageSize;
    return this;
  }

  withCursor(cursor?: string): this {
    this.criteria.cursor = cursor;
    return this;
  }

  build(): AssetCriteria {
    return { ...this.criteria };
  }
}
