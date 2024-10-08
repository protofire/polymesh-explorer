import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import { IdentityGraphRepo } from '@/services/repositories/IdentityGraphRepo';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Identity } from '@/domain/entities/Identity';
import { PaginatedData } from '@/types/pagination';
import { calculatePaginationInfo } from '@/utils/paginationUtils';

interface UseListIdentitiesParams {
  pageSize: number;
  cursor?: string;
  currentStartIndex: number;
}

export function useListIdentities({
  pageSize,
  cursor,
  currentStartIndex,
}: UseListIdentitiesParams): UseQueryResult<PaginatedData<Identity>, Error> {
  const { graphQlClient } = usePolymeshSdkService();
  const identityService = useMemo(() => {
    if (!graphQlClient) return null;
    return new IdentityGraphRepo(graphQlClient);
  }, [graphQlClient]);

  return useQuery<
    PaginatedData<Identity>,
    Error,
    PaginatedData<Identity>,
    [string, number, string | undefined, number]
  >({
    queryKey: ['identities', pageSize, cursor, currentStartIndex],
    queryFn: async () => {
      if (!identityService) throw new Error('Identity service not initialized');

      const result = await identityService.getIdentityList(pageSize, cursor);
      const paginationInfo = calculatePaginationInfo({
        totalCount: result.totalCount,
        pageSize,
        hasNextPage: result.hasNextPage,
        endCursor: result.endCursor,
        currentStartIndex,
      });

      return {
        data: result.identities,
        paginationInfo,
      };
    },
  });
}
