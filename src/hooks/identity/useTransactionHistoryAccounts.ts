import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { customReportError } from '@/utils/customReportError';
import { ExtrinsicGraphRepo } from '@/services/repositories/ExtrinsicGraphRepo';
import { Identity } from '@/domain/entities/Identity';

export interface Transaction {
  blockId: string;
  extrinsicIdx: number;
  address: string;
  nonce: number;
  moduleId: string;
  callId: string;
  paramsTxt: string;
  success: boolean;
  specVersionId: number;
  extrinsicHash: string;
  block: {
    hash: string;
    datetime: string;
  };
}

interface TransactionHistoryParams {
  size?: number;
  start?: number;
}

export interface UseTransactionHistoryAccountsResult {
  [key: string]: {
    extrinsics: Transaction[];
    totalCount: number;
  };
}

const DEFAULT_PARAMS: TransactionHistoryParams = {
  size: 10,
  start: 0,
};

export function useTransactionHistoryAccounts(
  identities: Identity[] | undefined,
  params?: TransactionHistoryParams,
): UseQueryResult<UseTransactionHistoryAccountsResult, Error> {
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

  return useQuery<UseTransactionHistoryAccountsResult, Error>({
    queryKey: ['useTransactionHistoryAccounts', groupedIdentities, params],
    queryFn: async () => {
      if (!extrinsicsService)
        throw new Error('Extrinsic service not initialized');

      try {
        const { size, start } = { ...DEFAULT_PARAMS, ...params };
        return await extrinsicsService?.getTransactionsByDid(
          groupedIdentities as Record<string, string[]>,
          start,
          size,
        );
      } catch (error) {
        customReportError(error);
        throw error;
      }
    },
    enabled:
      !!graphQlClient &&
      !!groupedIdentities &&
      identities &&
      identities?.length > 0,
  });
}
