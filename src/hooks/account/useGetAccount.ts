import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { AccountGraphRepository } from '@/services/repositories/AccountGraphRepository';
import { Account } from '@/domain/entities/Account';
import { customReportError } from '@/utils/customReportError';
import { transformAccount } from '@/services/transformers/accountTransformer';

interface Props {
  key: Account['key'];
}

export const useGetAccount = ({ key }: Props) => {
  const { graphQlClient, polymeshService } = usePolymeshSdkService();
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
        const accountEntitySdk =
          await polymeshService?.polymeshSdk.accountManagement.getAccount({
            address: key,
          });

        if (!accountEntitySdk) {
          throw new Error('Account not found');
        }

        const typeInfo = await accountEntitySdk.getTypeInfo();
        const identity = await accountEntitySdk.getIdentity();

        const transformedAccount = transformAccount(
          accountEntitySdk,
          typeInfo,
          identity?.did,
        );

        return transformedAccount;
      } catch (e) {
        customReportError(e);
        throw e;
      }
    },
    enabled: !!key && !!accountService && !!polymeshService,
  });
};
