'use client';

import React, { useMemo, useState } from 'react';
import { useSearchPolymeshEntity } from '@/hooks/polymeshEntity/useSearchPolymeshEntity';
import { transformToOption } from '@/domain/trasnformers/toSearchTextInputOption';
import { SearchTextInput } from '@/components/shared/SearchTextInput';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';

export function LayoutSearchTextInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const { isLoading: isLoadingSdk } = usePolymeshSdkService();
  const {
    data: results,
    isFetching: isLoading,
    refetch,
  } = useSearchPolymeshEntity({
    searchTerm,
  });

  const options = useMemo(() => {
    return results.map((result) => transformToOption(result));
  }, [results]);

  return (
    <SearchTextInput
      paddingTop="0.6rem"
      label="Search by DID / Venue / Asset / Settlement"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      options={options}
      isLoading={isLoading || isLoadingSdk}
      onRefetch={refetch}
    />
  );
}
