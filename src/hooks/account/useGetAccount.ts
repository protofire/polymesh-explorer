import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { AccountGraphRepository } from '@/services/repositories/AccountGraphRepository';
import { Account } from '@/domain/entities/Account';

interface Props {
  key: Account['key'];
}

export const useGetAccount = ({ key }: Props) => {
  const { graphQlClient } = usePolymeshSdkService();
  const accountService = useMemo(() => {
    if (!graphQlClient) return null;

    const service = new AccountGraphRepository(graphQlClient);

    return service;
  }, [graphQlClient]);

  return useQuery({
    queryKey: ['useGetAccount', accountService, key],
    queryFn: async () => {
      if (!accountService) return null;
      try {
        return await accountService.findByKey(key);
      } catch (e) {
        console.error('Error with account:', e);
        return null;
      }
    },
    enabled: !!key && !!accountService,
  });
};
