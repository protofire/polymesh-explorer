import { useState, useCallback, useMemo } from 'react';
import {
  AssetTokenType,
  AssetCriteriaBuilder,
} from '@/domain/criteria/AssetCriteria';

export interface AssetCriteriaController {
  criteria: {
    assetType: AssetTokenType;
  };
  setAssetType: (assetType: AssetTokenType) => void;
  buildCriteria: (
    pageSize: number,
    cursor?: string,
  ) => ReturnType<AssetCriteriaBuilder['build']>;
}

export function useAssetCriteriaController(
  initialAssetType: AssetTokenType = 'All',
): AssetCriteriaController {
  const [assetType, setAssetType] = useState<AssetTokenType>(initialAssetType);

  const buildCriteria = useCallback(
    (pageSize: number, cursor?: string) => {
      return new AssetCriteriaBuilder()
        .withAssetType(assetType)
        .withPageSize(pageSize)
        .withCursor(cursor)
        .build();
    },
    [assetType],
  );

  return useMemo(
    () => ({
      criteria: {
        assetType,
      },
      setAssetType,
      buildCriteria,
    }),
    [assetType, buildCriteria],
  );
}
