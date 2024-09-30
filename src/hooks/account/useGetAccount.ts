import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { AccountGraphRepository } from '@/services/repositories/AccountGraphRepository';
import { Account } from '@/domain/entities/Account';

interface Props {
  address: Account['address'];
}

export const useGetAccount = ({ address }: Props) => {
  const { graphQlClient } = usePolymeshSdkService();
  const accountService = useMemo(() => {
    if (!graphQlClient) return null;

    const service = new AccountGraphRepository(graphQlClient);

    return service;
  }, [graphQlClient]);

  return useQuery({
    queryKey: ['useGetAccount', accountService, address],
    queryFn: async () => {
      if (!accountService) return null;
      try {
        return await accountService.findByAddress(address);
      } catch (e) {
        console.error('Error with account:', e);
        return null;
      }
    },
    enabled: !!address && !!accountService,
  });
};