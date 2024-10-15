import React from 'react';
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
}: SummaryIdentitiesCardProps) {
  const renderChartContent = () => {
    if (isLoading) return <SummaryIdentitySkeleton />;
    if (error) return renderError(error);
    if (!chartData) return null;
    return <IdentitiesByMonthChart chartData={chartData} />;
  };

  const renderTotalCreatedIdentities = () => {
    if (isLoading || totalVerifiedIdentities === 0) {
      return <Skeleton variant="text" width="60%" height={60} />;
    }
    return (
      <Typography variant="h3">
        {totalVerifiedIdentities.toLocaleString()}
      </Typography>
    );
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
            Identities verified per Month
          </Typography>
          {renderChartContent()}
        </CardContent>
      </Card>
      <Box sx={{ flexDirection: 'column', flex: 1, gap: 2 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Created Identities
            </Typography>
            {renderTotalCreatedIdentities()}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
