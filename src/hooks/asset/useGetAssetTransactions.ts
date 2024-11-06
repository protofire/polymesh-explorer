import { useQueries, UseQueryResult } from '@tanstack/react-query';
import {
  Asset as AssetSdk,
  HistoricAssetTransaction,
  HistoricNftTransaction,
  ResultSet,
  DefaultPortfolio,
  NumberedPortfolio,
  Nft,
  EventIdEnum,
  VenueFilteringDetails,
} from '@polymeshassociation/polymesh-sdk/types';
import { BigNumber } from '@polymeshassociation/polymesh-sdk';
import { useCallback } from 'react';
import { Asset } from '@/domain/entities/Asset';
import { customReportError } from '@/utils/customReportError';
import { usePaginationControllerGraphQl } from '../usePaginationControllerGraphQl';
import { PaginationController } from '@/domain/ui/PaginationInfo';

export interface AssetTransactionFromAsset {
  transactionId: string;
  timestamp: Date;
  from: string | null;
  to: string | null;
  amount: string;
  event: EventIdEnum;
  venue?: string;
  fundingRound?: string;
  instructionId?: string;
  instructionMemo?: string;
  nfts?: string[];
}

interface Props {
  asset: Asset;
  assetSdk: AssetSdk | undefined;
}

const getPortfolioDid = (
  portfolio: DefaultPortfolio | NumberedPortfolio | null,
): string | null => {
  if (!portfolio) return null;
  return portfolio.owner.did;
};

const generateTransactionId = (
  blockNumber: BigNumber,
  eventIndex: BigNumber,
  extrinsicIndex: BigNumber,
): string => {
  return `${blockNumber.toString()}-${eventIndex.toString()}-${extrinsicIndex.toString()}`;
};

export interface UseGetAssetTransactionsReturn {
  transactions: {
    data: AssetTransactionFromAsset[] | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  venueFiltering: {
    data: VenueFilteringDetails | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  isLoading: boolean;
  error: Error | null;
  paginationController: PaginationController;
}

export const useGetAssetTransactions = ({
  asset,
  assetSdk,
}: Props): UseGetAssetTransactionsReturn => {
  const paginationController = usePaginationControllerGraphQl({
    useOffset: true,
  });

  const transformNftTransaction = useCallback(
    (tx: HistoricNftTransaction): AssetTransactionFromAsset => {
      return {
        transactionId: generateTransactionId(
          tx.blockNumber,
          tx.eventIndex,
          tx.extrinsicIndex,
        ),
        timestamp: tx.blockDate,
        from: getPortfolioDid(tx.from),
        to: getPortfolioDid(tx.to),
        amount: tx.nfts.length.toString(),
        event: tx.event,
        venue: tx.asset.id.toString(),
        fundingRound: tx.fundingRound,
        instructionId: tx.instructionId?.toString(),
        instructionMemo: tx.instructionMemo,
        nfts: tx.nfts.map((nft: Nft) => nft.id.toString()),
      };
    },
    [],
  );

  const transformFungibleTransaction = useCallback(
    (tx: HistoricAssetTransaction): AssetTransactionFromAsset => {
      return {
        transactionId: generateTransactionId(
          tx.blockNumber,
          tx.eventIndex,
          tx.extrinsicIndex,
        ),
        timestamp: tx.blockDate,
        from: getPortfolioDid(tx.from),
        to: getPortfolioDid(tx.to),
        amount: tx.amount.toString(),
        event: tx.event,
        venue: tx.asset.id.toString(),
        fundingRound: tx.fundingRound,
        instructionId: tx.instructionId?.toString(),
        instructionMemo: tx.instructionMemo,
      };
    },
    [],
  );

  const results = useQueries({
    queries: [
      {
        queryKey: ['venueFiltering', assetSdk?.toHuman()],
        queryFn: async () => {
          if (!assetSdk) {
            throw new Error('Asset SDK not initialized');
          }
          return assetSdk.getVenueFilteringDetails();
        },
        enabled: !!assetSdk,
      },
      {
        queryKey: [
          'assetTransactions',
          asset?.assetId,
          paginationController.paginationInfo.pageSize,
          paginationController.paginationInfo.cursor,
        ],
        queryFn: async () => {
          if (!assetSdk) {
            throw new Error('Asset SDK not initialized');
          }

          try {
            const history = await assetSdk.getTransactionHistory({
              size: new BigNumber(paginationController.paginationInfo.pageSize),
              start: paginationController.paginationInfo.offset
                ? new BigNumber(paginationController.paginationInfo.offset)
                : undefined,
            });

            if ('count' in history) {
              paginationController.setPageInfo({
                totalCount: history.count?.toNumber() || 0,
                hasNextPage: history.next !== null,
                hasPreviousPage:
                  paginationController.paginationInfo.offset !== 0,
                startCursor: history.next?.toString() || null,
                endCursor: history.next?.toString() || null,
              });
            }

            const transactions = asset.isNftCollection
              ? (history as ResultSet<HistoricNftTransaction>).data.map(
                  transformNftTransaction,
                )
              : (history as ResultSet<HistoricAssetTransaction>).data.map(
                  transformFungibleTransaction,
                );

            return transactions;
          } catch (error) {
            customReportError(error);
            throw error;
          }
        },
        enabled: !!assetSdk || !!asset || !!paginationController,
      },
    ],
  }) as [
    UseQueryResult<VenueFilteringDetails, Error>,
    UseQueryResult<AssetTransactionFromAsset[], Error>,
  ];

  const [venueFilteringQuery, transactionsQuery] = results;

  const filteredTransactions =
    transactionsQuery.data && venueFilteringQuery.data?.isEnabled
      ? transactionsQuery.data.filter(
          (tx) =>
            tx.venue &&
            venueFilteringQuery.data.allowedVenues.some(
              (v) => v.toString() === tx.venue,
            ),
        )
      : transactionsQuery.data;

  return {
    transactions: {
      data: filteredTransactions,
      isLoading: transactionsQuery.isLoading,
      error: transactionsQuery.error,
    },
    venueFiltering: {
      data: venueFilteringQuery.data,
      isLoading: venueFilteringQuery.isLoading,
      error: venueFilteringQuery.error,
    },
    isLoading: venueFilteringQuery.isLoading || transactionsQuery.isLoading,
    error: venueFilteringQuery.error || transactionsQuery.error || null,
    paginationController,
  };
};
