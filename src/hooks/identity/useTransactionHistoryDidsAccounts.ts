import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { customReportError } from '@/utils/customReportError';
import { ExtrinsicGraphRepo } from '@/services/repositories/ExtrinsicGraphRepo';
import { Identity } from '@/domain/entities/Identity';
import { ExtrinsicTransaction } from '@/domain/entities/ExtrinsicTransaction';

export interface UseTransactionHistoryDidsAccountsResult {
  [key: string]: {
    extrinsics: ExtrinsicTransaction[];
    totalCount: number;
  };
}

const LAST_TRANSACTION_SIZE = 1;

export function useTransactionHistoryDidsAccounts(
  identities: Identity[] | undefined,
): UseQueryResult<UseTransactionHistoryDidsAccountsResult, Error> {
  const { graphQlClient } = usePolymeshSdkService();

  const extrinsicsService = useMemo(() => {
    if (!graphQlClient) return null;

    return new ExtrinsicGraphRepo(graphQlClient);
  }, [graphQlClient]);

  const groupedIdentities = useMemo(() => {
    return identities?.reduce(
      (acc, i) => {
        acc[i.did] = [i.primaryAccount, ...i.secondaryAccounts];
        return acc;
      },
      {} as Record<string, string[]>,
    );
  }, [identities]);

  return useQuery<UseTransactionHistoryDidsAccountsResult, Error>({
    queryKey: [
      'useTransactionHistoryAccounts',
      graphQlClient,
      groupedIdentities,
    ],
    queryFn: async () => {
      if (!extrinsicsService)
        throw new Error('Extrinsic service not initialized');

      try {
        return await extrinsicsService.getTransactionsByDidsAddresses(
          groupedIdentities as Record<string, string[]>,
          0,
          LAST_TRANSACTION_SIZE,
        );
      } catch (error) {
        customReportError(error);
        throw error;
      }
    },
    enabled:
      !!graphQlClient &&
      !!groupedIdentities &&
      !!extrinsicsService &&
      identities &&
      identities?.length > 0,
  });
}
