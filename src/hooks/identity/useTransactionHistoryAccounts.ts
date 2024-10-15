import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { customReportError } from '@/utils/customReportError';
import { ExtrinsicGraphRepo } from '@/services/repositories/ExtrinsicGraphRepo';
import { Identity } from '@/domain/entities/Identity';
import { ExtrinsicTransaction } from '@/domain/entities/ExtrinsicTransaction';
import { getIdentityAddresses } from '@/utils/identityUtils';
import { usePaginationControllerGraphQl } from '@/hooks/usePaginationControllerGraphQl';
import { PaginatedData } from '@/domain/ui/PaginationInfo';

export type UseTransactionHistoryAccountsReturn = PaginatedData<
  ExtrinsicTransaction[]
>;

interface UseTransactionHistoryAccountsParams {
  identity?: Identity | null;
}

export function useTransactionHistoryAccounts({
  identity,
}: UseTransactionHistoryAccountsParams): UseQueryResult<UseTransactionHistoryAccountsReturn> {
  const { graphQlClient } = usePolymeshSdkService();
  const extrinsicsRepo = useMemo(() => {
    if (!graphQlClient) return null;
    return new ExtrinsicGraphRepo(graphQlClient);
  }, [graphQlClient]);

  const paginationController = usePaginationControllerGraphQl({
    useOffset: true,
  });

  const addresses = useMemo(
    () => (identity ? getIdentityAddresses(identity) : []),
    [identity],
  );

  const fetchTransactions = async () => {
    if (!extrinsicsRepo) {
      throw new Error('ExtrinsicRepo is not initialized');
    }

    try {
      const result = await extrinsicsRepo.getTransactionsByAddresses(
        addresses,
        paginationController.paginationInfo.offset,
        paginationController.paginationInfo.pageSize,
      );

      paginationController.setPageInfo({
        hasNextPage: result.pageInfo.hasNextPage,
        hasPreviousPage: result.pageInfo.hasPreviousPage,
        startCursor: result.pageInfo.startCursor,
        endCursor: result.pageInfo.endCursor,
        totalCount: result.totalCount,
      });

      return result.extrinsics;
    } catch (e) {
      customReportError(e);
      throw e;
    }
  };

  return useQuery<
    ExtrinsicTransaction[],
    Error,
    UseTransactionHistoryAccountsReturn
  >({
    queryKey: [
      'useTransactionHistoryAccounts',
      graphQlClient,
      addresses,
      paginationController.paginationInfo.pageSize,
      paginationController.paginationInfo.offset,
    ],
    queryFn: fetchTransactions,
    select: (data: ExtrinsicTransaction[]) => ({
      data,
      paginationController,
    }),
    enabled:
      !!graphQlClient && !!extrinsicsRepo && addresses.length > 0 && !!identity,
  });
}
