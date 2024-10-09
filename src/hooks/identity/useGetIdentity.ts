import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Identity } from '@/domain/entities/Identity';
import { IdentityGraphRepo } from '@/services/repositories/IdentityGraphRepo';
import { customReportError } from '@/utils/customReportError';

interface Props {
  did: Identity['did'];
}

export const useGetIdentity = ({ did }: Props) => {
  const { graphQlClient } = usePolymeshSdkService();
  const identityService = useMemo(() => {
    if (!graphQlClient) return null;

    return new IdentityGraphRepo(graphQlClient);
  }, [graphQlClient]);

  return useQuery({
    queryKey: ['useGetIdentity', identityService, did],
    queryFn: async () => {
      if (!identityService) return null;
      try {
        return await identityService.findByIdentifier(did);
      } catch (e) {
        customReportError(e);
        throw e;
      }
    },
    enabled: !!did || !!identityService,
  });
};
