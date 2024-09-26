'use client';

import React, { useMemo, useState } from 'react';
import { useSearchPolymeshEntity } from '@/hooks/polymeshEntity/useSearchPolymeshEntity';
import { transformToOption } from '@/domain/trasnformers/toSearchTextInputOption';
import { SearchTextInput } from '@/components/shared/SearchTextInput';

export function LayoutSearchTextInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    data,
    isFetching: isLoading,
    refetch,
  } = useSearchPolymeshEntity({
    searchTerm,
  });

  const options = useMemo(() => {
    if (!data.searchCriteria.type) return [];
    return [transformToOption(data)];
  }, [data]);

  return (
    <SearchTextInput
      label="Search by DID / Venue / Asset / Portfolio"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      options={options}
      isLoading={isLoading}
      onRefetch={refetch}
    />
  );
}
