import React from 'react';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { EmptyDash } from '@/components/shared/common/EmptyDash';
import { truncateAddress } from '@/services/polymesh/address';
import { Asset } from '@/domain/entities/Asset';
import { ROUTES } from '@/config/routes';

export function EmptyOrCollectionLink({
  collection,
}: {
  collection: Asset | null | undefined;
}) {
  if (!collection) return <EmptyDash />;

  return (
    <GenericLink href={`${ROUTES.Asset}/${collection.assetId}`}>
      {collection.ticker || truncateAddress(collection.assetUuid)}
    </GenericLink>
  );
}
