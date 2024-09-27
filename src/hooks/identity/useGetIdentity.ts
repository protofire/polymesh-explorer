import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { GraphIdentityRepo } from '@/services/repositories/GraphIdentityRepo';
import { Identity } from '@/domain/entities/Identity';

interface Props {
  did: Identity['did'];
}

export const useGetIdentity = ({ did }: Props) => {
  const { graphQlClient } = usePolymeshSdkService();
  const { identityService } = useMemo(() => {
    return { identityService: new GraphIdentityRepo(graphQlClient) };
  }, [graphQlClient]);

  return useQuery({
    queryKey: ['useGetIdentity', did],
    queryFn: async () => {
      if (!identityService) return null;
      try {
        return await identityService.findByIdentifier(did);
      } catch (e) {
        console.error('Error with identity:', e);
        return null;
      }
    },
    enabled: !!did || !!identityService,
  });
};
