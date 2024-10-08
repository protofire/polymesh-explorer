import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  ExtrinsicData,
  ExtrinsicsOrderBy,
  ResultSet,
} from '@polymeshassociation/polymesh-sdk/types';
import { BigNumber } from '@polymeshassociation/polymesh-sdk';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { customReportError } from '@/utils/customReportError';

interface TransactionHistoryParams {
  orderBy?: ExtrinsicsOrderBy;
  size?: BigNumber;
  start?: BigNumber;
}

const DEFAULT_PARAMS: TransactionHistoryParams = {
  orderBy: ExtrinsicsOrderBy.CreatedAtDesc,
  size: new BigNumber(10),
  start: new BigNumber(0),
};

export function useAccountsTransactionHistory(
  addresses: string[],
  params: TransactionHistoryParams = DEFAULT_PARAMS,
): UseQueryResult<ResultSet<ExtrinsicData>[], Error> {
  const { polymeshService } = usePolymeshSdkService();

  return useQuery<ResultSet<ExtrinsicData>[], Error>({
    queryKey: ['accountsTransactionHistory', addresses, params],
    queryFn: async () => {
      try {
        if (!polymeshService?.polymeshSdk) {
          throw new Error('Polymesh SDK not initialized');
        }
        return await polymeshService.getAccountsTransactionHistory(
          addresses,
          params,
        );
      } catch (error) {
        customReportError(error);
        throw error;
      }
    },
    enabled: !!polymeshService?.polymeshSdk && addresses.length > 0,
  });
}
