import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Identity } from '@/domain/entities/Identity';
import { IdentityGraphRepo } from '@/services/repositories/IdentityGraphRepo';
import { customReportError } from '@/utils/customReportError';

interface Props {
  identityDid: Identity['did'];
}

export const useGetIdentity = ({ identityDid }: Props) => {
  const { graphQlClient } = usePolymeshSdkService();
  const identityService = useMemo(() => {
    if (!graphQlClient) return null;

    return new IdentityGraphRepo(graphQlClient);
  }, [graphQlClient]);

  const queryResult = useQuery({
    queryKey: ['useGetIdentity', identityService, identityDid],
    queryFn: async () => {
      if (!identityService) return null;
      try {
        const identity = await identityService.findByIdentifier(identityDid);

        return identity;
      } catch (e) {
        customReportError(e);
        throw e;
      }
    },
    enabled: !!identityDid || !!identityService,
  });

  return queryResult;
};
