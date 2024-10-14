import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import { IdentityGraphRepo } from '@/services/repositories/IdentityGraphRepo';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Identity } from '@/domain/entities/Identity';
import { usePaginationControllerGraphQl } from '@/hooks/usePaginationControllerGraphQl';
import { PaginatedData } from '@/domain/ui/PaginationInfo';

export type UseListIdentitiesReturn = PaginatedData<Identity[]>;

export function useListIdentities(): UseQueryResult<UseListIdentitiesReturn> {
  const { graphQlClient } = usePolymeshSdkService();
  const identityService = useMemo(() => {
    if (!graphQlClient) return null;
    return new IdentityGraphRepo(graphQlClient);
  }, [graphQlClient]);

  const paginationController = usePaginationControllerGraphQl();

  const fetchIdentities = useCallback(async () => {
    if (!identityService) {
      throw new Error('IdentityService is not initialized');
    }

    const result = await identityService.getIdentityList(
      paginationController.paginationInfo.pageSize,
      paginationController.paginationInfo.cursor ?? undefined,
    );

    paginationController.setPageInfo({
      hasNextPage: result.pageInfo.hasNextPage,
      hasPreviousPage: result.pageInfo.hasPreviousPage,
      startCursor: result.pageInfo.startCursor,
      endCursor: result.pageInfo.endCursor,
      totalCount: result.totalCount,
    });

    return result.identities;
  }, [identityService, paginationController]);

  return useQuery<Identity[], Error, UseListIdentitiesReturn>({
    queryKey: [
      'useListIdentities',
      graphQlClient,
      paginationController.paginationInfo.pageSize,
      paginationController.paginationInfo.cursor,
    ],
    queryFn: fetchIdentities,
    select: useCallback(
      (data: Identity[]) => ({
        data,
        paginationController,
      }),
      [paginationController],
    ),
    enabled: !!graphQlClient && !!identityService,
  });
}
