import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { IdentityGraphRepo } from '@/services/repositories/IdentityGraphRepo';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Identity } from '@/domain/entities/Identity';
import { customReportError } from '@/utils/customReportError';
import {
  DEFAULT_PAGE_SIZE,
  usePaginationControllerGraphQl,
} from '@/hooks/usePaginationControllerGraphQl';
import { PaginatedData } from '@/domain/ui/PaginationInfo';

export type UseListIdentitiesReturn = PaginatedData<Identity[]>;

export function useListIdentities(
  initialPageSize: number = DEFAULT_PAGE_SIZE,
): UseQueryResult<UseListIdentitiesReturn> {
  const { graphQlClient } = usePolymeshSdkService();
  const identityService = new IdentityGraphRepo(graphQlClient);
  const paginationController = usePaginationControllerGraphQl({
    initialPageSize,
  });

  return useQuery<UseListIdentitiesReturn, Error>({
    queryKey: [
      'useListIdentities',
      graphQlClient,
      paginationController.paginationInfo.pageSize,
      paginationController.paginationInfo.cursor,
    ],
    queryFn: async () => {
      try {
        const result = await identityService.getIdentityList(
          paginationController.paginationInfo.pageSize,
          paginationController.paginationInfo.cursor ?? undefined,
        );

        paginationController.setPageInfo({
          ...result.pageInfo,
          totalCount: result.totalCount,
          pageSize: paginationController.paginationInfo.pageSize,
          currentStartIndex:
            paginationController.paginationInfo.currentStartIndex,
        });

        return {
          data: result.identities,
          paginationController,
        };
      } catch (e) {
        customReportError(e);
        throw e;
      }
    },
    enabled: !!graphQlClient,
  });
}
