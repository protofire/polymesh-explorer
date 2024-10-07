'use client';

import React, { useMemo } from 'react';
import { useListIdentities } from '@/hooks/identity/useListIdentities';
import { IdentityTable } from '@/components/identity/IdentityTable/IdentityTable';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const PAGE_SIZE = 10;

export default function IdentityPage() {
  const [cursor, setCursor] = React.useState<string | undefined>(undefined);
  const { data, isLoading, error, isFetching } = useListIdentities({
    pageSize: PAGE_SIZE,
    cursor,
  });

  const handleFirstPage = () => setCursor(undefined);
  const handleNextPage = () => setCursor(data?.endCursor);

  const chartData = useMemo(() => {
    if (!data?.creationDates) return [];

    const countByMonth: { [key: string]: number } = {};
    data.creationDates.forEach((date) => {
      const monthYear = new Date(date).toLocaleString('default', { month: 'short', year: 'numeric' });
      countByMonth[monthYear] = (countByMonth[monthYear] || 0) + 1;
    });

    return Object.entries(countByMonth).map(([date, count]) => ({ date, count }));
  }, [data?.creationDates]);

  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
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
