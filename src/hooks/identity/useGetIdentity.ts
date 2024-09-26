import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { GraphIdentityRepo } from '@/services/repositories/GraphIdentityRepo';

export const useGetIdentity = (identityId: string) => {
  const { graphQlClient } = usePolymeshSdkService();
  const { identityService } = useMemo(() => {
    return { identityService: new GraphIdentityRepo(graphQlClient) };
  }, [graphQlClient]);

  return useQuery({
    queryKey: ['useGetIdentity', identityId],
    queryFn: async () => {},
    enabled: !!identityId || !!identityService,
  });
};
