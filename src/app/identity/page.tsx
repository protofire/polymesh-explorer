'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useListIdentities } from '@/hooks/identity/useListIdentities';
import { IdentityTable } from '@/components/identity/IdentityTable/IdentityTable';
import { useIdentityCreationCountByMonth } from '@/hooks/identity/useIdentityCreationCountByMonth';

const PAGE_SIZE = 10;

export default function IdentityPage() {
  const [cursor, setCursor] = React.useState<string | undefined>(undefined);
  const { data, isLoading, error, isFetching } = useListIdentities({
    pageSize: PAGE_SIZE,
    cursor,
  });
  const {
    data: chartData,
    isLoading: isChartLoading,
    error: chartError,
  } = useIdentityCreationCountByMonth();

  const handleFirstPage = () => setCursor(undefined);
  const handleNextPage = () => setCursor(data?.endCursor);

  React.useEffect(() => {
    if (chartError) {
      console.error('Error in IdentityPage component:', chartError);
    }
  }, [chartError]);

  return (
    <>
      {isChartLoading ? (
        <p>Loading chart data...</p>
      ) : chartError ? (
        <p>
          Error loading chart data:{' '}
          {chartError instanceof Error ? chartError.message : 'Unknown error'}
        </p>
      ) : (
        <ResponsiveContainer width="50%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}
      <IdentityTable
        identities={data?.identities || []}
        isLoading={isLoading}
        error={error}
        hasNextPage={data?.hasNextPage || false}
        isPreviousData={isFetching}
        onFirstPage={handleFirstPage}
        onNextPage={handleNextPage}
        cursor={cursor}
      />
    </>
  );
}
