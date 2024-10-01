import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import { IdentityGraphRepo } from '@/services/repositories/IdentityGraphRepo';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Identity } from '@/domain/entities/Identity';

interface IdentityListResult {
  identities: Identity[];
  totalCount: number;
  hasNextPage: boolean;
  endCursor: string;
}

interface UseListIdentitiesParams {
  pageSize: number;
  cursor?: string;
}

export function useListIdentities({
  pageSize,
  cursor,
}: UseListIdentitiesParams): UseQueryResult<IdentityListResult, Error> {
  const { graphQlClient } = usePolymeshSdkService();
  const identityService = useMemo(() => {
    if (!graphQlClient) return null;

    return new IdentityGraphRepo(graphQlClient);
  }, [graphQlClient]);

  return useQuery<
    IdentityListResult,
    Error,
    IdentityListResult,
    [string, number, string | undefined]
  >({
    queryKey: ['identities', pageSize, cursor],
    queryFn: async () => {
      if (!identityService) throw new Error('Identity service not initialized');

      return identityService.getIdentityList(pageSize, cursor);
    },
  });
}
