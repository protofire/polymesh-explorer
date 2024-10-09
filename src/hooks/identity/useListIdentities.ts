import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { IdentityGraphRepo } from '@/services/repositories/IdentityGraphRepo';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Identity } from '@/domain/entities/Identity';
import { PaginatedData } from '@/types/pagination';
import { calculatePaginationInfo } from '@/utils/paginationUtils';
import { customReportError } from '@/utils/customReportError';

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
  const identityService = new IdentityGraphRepo(graphQlClient);

  return useQuery<PaginatedData<Identity>, Error>({
    queryKey: ['identities', pageSize, cursor, currentStartIndex],
    queryFn: async () => {
      try {
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
      } catch (error) {
        customReportError(error);
        throw error;
      }
    },
    enabled: !!graphQlClient,
  });
}
