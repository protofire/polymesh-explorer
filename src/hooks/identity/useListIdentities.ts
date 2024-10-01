import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import { IdentityGraphRepo } from '@/services/repositories/IdentityGraphRepo';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';

interface IdentityListItem {
  did: string;
  primaryAccount: string;
  portfoliosCount: number;
  claimsCount: number;
  recentActivity: {
    hash: string;
    module: string;
    call: string;
    success: boolean;
    blockId: string;
  } | null;
  isCustodian: boolean;
}

interface IdentityListResult {
  identities: IdentityListItem[];
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
