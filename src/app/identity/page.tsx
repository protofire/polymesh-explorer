'use client';

import React from 'react';
import { Typography } from '@mui/material';
import { useListIdentities } from '@/hooks/identity/useListIdentities';
import { IdentityTable } from '@/components/identity/IdentityTable/IdentityTable';
import { useIdentityCreationCountByMonth } from '@/hooks/identity/useIdentityCreationCountByMonth';
import { SummaryIdentitiesCard } from '@/components/identity/SummaryIdentitiesCard/SummaryIdentitiesCard';
import { MainWrapper } from '@/components/shared/layout/mainWrapper';
import { SkeletonIdentityTable } from '@/components/identity/IdentityTable/SkeletonIdentityTable';
import { useTransactionHistoryDidsAccounts } from '@/hooks/identity/useTransactionHistoryDidsAccounts';

export default function IdentityPage() {
  const { data, isLoading, error } = useListIdentities();
  const { data: dataHistory, isFetched: isDataHistoryFetched } =
    useTransactionHistoryDidsAccounts(data?.data);

  const {
    data: chartData,
    isLoading: isChartLoading,
    isFetched: isChartFetched,
    error: chartError,
  } = useIdentityCreationCountByMonth();

  return (
    <MainWrapper>
      <Typography variant="h4" mb={2}>
        Identities overview
      </Typography>
      <SummaryIdentitiesCard
        chartData={chartData}
        isLoading={isChartLoading || !isChartFetched}
        error={chartError}
        totalVerifiedIdentities={
          chartData?.reduce((sum, item) => sum + Number(item.count), 0) || 0
        }
      />
      {isLoading || dataHistory === undefined ? (
        <SkeletonIdentityTable />
      ) : (
        data && (
          <IdentityTable
            paginatedIdentities={data}
            error={error}
            transactionHistory={dataHistory}
            isTransactionHistoryFetched={isDataHistoryFetched}
          />
        )
      )}
    </MainWrapper>
  );
}
