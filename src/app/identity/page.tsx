'use client';

import React from 'react';
import { useListIdentities } from '@/hooks/identity/useListIdentities';
import { IdentityTable } from '@/components/identity/IdentityTable/IdentityTable';

const PAGE_SIZE = 10;

export default function IdentityPage() {
  const [cursor, setCursor] = React.useState<string | undefined>(undefined);
  const { data, isLoading, error, isFetching } = useListIdentities({
    pageSize: PAGE_SIZE,
    cursor,
  });

  const handleFirstPage = () => setCursor(undefined);
  const handleNextPage = () => setCursor(data?.endCursor);

  return (
    <IdentityTable
      identities={data?.identities || []}
      isLoading={isLoading}
      error={error}
      hasNextPage={data?.hasNextPage || false}
      isPreviousData={isFetching}
      onFirstPage={handleFirstPage}
      onNextPage={handleNextPage}
      cursor={cursor}
    />
  );
}
