'use client';

import React from 'react';
import { useListIdentities } from '@/hooks/identity/useListIdentities';
import { IdentityTable } from '@/components/identity/IdentityTable/IdentityTable';
import { useIdentityCreationCountByMonth } from '@/hooks/identity/useIdentityCreationCountByMonth';
import { SummaryIdentitiesCard } from '@/components/identity/SummaryIdentitiesCard/SummaryIdentitiesCard';
import { useTransactionHistoryAccounts } from '@/hooks/identity/useTransactionHistoryAccounts';

const PAGE_SIZE = 10;

export default function IdentityPage() {
  const [cursor, setCursor] = React.useState<string | undefined>(undefined);
  const [currentStartIndex, setCurrentStartIndex] = React.useState(1);
  const { data, isFetched, error, isFetching } = useListIdentities({
    pageSize: PAGE_SIZE,
    cursor,
    currentStartIndex,
  });
  const { data: dataHistory } = useTransactionHistoryAccounts(data?.data, {
    size: 1,
  });

  const {
    data: chartData,
    isLoading: isChartLoading,
    isFetched: isChartFetched,
    error: chartError,
  } = useIdentityCreationCountByMonth();

  const handleFirstPage = () => {
    setCursor(undefined);
    setCurrentStartIndex(1);
  };

  const handleNextPage = () => {
    if (data?.paginationInfo.hasNextPage) {
      setCursor(data.paginationInfo.endCursor);
      setCurrentStartIndex(currentStartIndex + PAGE_SIZE);
    }
  };

  return (
    <>
      <SummaryIdentitiesCard
        chartData={chartData}
        isLoading={isChartLoading || !isChartFetched}
        error={chartError}
        totalVerifiedIdentities={
          chartData?.reduce((sum, item) => sum + Number(item.count), 0) || 0
        }
      />
      {data && (
        <IdentityTable
          paginatedIdentities={data}
          isLoading={!isFetched}
          error={error}
          isPreviousData={isFetching}
          onFirstPage={handleFirstPage}
          onNextPage={handleNextPage}
          transactionHistory={dataHistory}
        />
      )}
    </>
  );
}
