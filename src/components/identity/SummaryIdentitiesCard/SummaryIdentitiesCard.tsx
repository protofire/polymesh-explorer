import React, { useRef, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Skeleton } from '@mui/material';
import { SummaryIdentitySkeleton } from './SummaryIdentitySkeleton';
import { IdentitiesByMonthChart } from './IdentitiesByMonthChart';

interface ChartData {
  date: string;
  count: number;
}

interface SummaryIdentitiesCardProps {
  chartData: ChartData[] | undefined;
  isLoading: boolean;
  error: unknown;
  totalVerifiedIdentities: number;
  nMonths: number;
  totalIdentities: number | undefined;
}

const renderError = (error: unknown) => (
  <Typography color="error">
    Error loading chart data:{' '}
    {error instanceof Error ? error.message : 'Unknown error'}
  </Typography>
);

export function SummaryIdentitiesCard({
  chartData,
  isLoading,
  error,
  totalVerifiedIdentities,
  nMonths,
  totalIdentities,
}: SummaryIdentitiesCardProps) {
  const lastValidTotalIdentitiesRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (totalIdentities !== undefined) {
      lastValidTotalIdentitiesRef.current = totalIdentities;
    }
  }, [totalIdentities]);

  const renderChartContent = () => {
    if (isLoading) return <SummaryIdentitySkeleton />;
    if (error) return renderError(error);
    if (!chartData) return null;
    return <IdentitiesByMonthChart chartData={chartData} />;
  };

  const renderTotalIdentities = (value: number, showSkeleton: boolean) => {
    if (showSkeleton) {
      return <Skeleton variant="text" width="60%" height={60} />;
    }
    return <Typography variant="h3">{value.toLocaleString()}</Typography>;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        gap: 2,
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      <Card sx={{ flex: 1 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Identities Created per Month (Last {nMonths} Months)
          </Typography>
          {renderChartContent()}
        </CardContent>
      </Card>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Identities Created (Last {nMonths} Months)
            </Typography>
            {renderTotalIdentities(
              totalVerifiedIdentities,
              isLoading || totalVerifiedIdentities === 0,
            )}
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Identities Created (All Time)
            </Typography>
            {renderTotalIdentities(
              lastValidTotalIdentitiesRef.current ?? 0,
              lastValidTotalIdentitiesRef.current === undefined,
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
