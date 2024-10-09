import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { Box, Card, CardContent, Typography, Skeleton } from '@mui/material';
import { SummaryIdentitySkeleton } from './SummaryIdentitySkeleton';

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

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 1,
          border: '1px solid #ffffff55',
          borderRadius: '4px',
        }}
      >
        <Typography variant="body2">{`${label}: ${payload[0].value}`}</Typography>
      </Box>
    );
  }
  return null;
}

const renderChart = (chartData: ChartData[]) => {
  const maxCount = Math.max(...chartData.map((item) => item.count));
  const yAxisMax = Math.ceil(maxCount * 1.1); // 10% more than the max value

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 50, bottom: 60 }}
        barCategoryGap={5}
      >
        <XAxis
          dataKey="date"
          scale="point"
          padding={{ left: 10, right: 10 }}
          tick={{ fontSize: 12 }}
          interval={0}
          angle={-45}
          textAnchor="end"
          tickMargin={20}
        />
        <YAxis
          allowDecimals={false}
          scale="linear"
          axisLine={false}
          tickLine={false}
          domain={[0, yAxisMax]}
          tickFormatter={(value: number) => value.toLocaleString()}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ff2e7471' }} />
        <Bar dataKey="count" fill="#FF2E72" maxBarSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );
};

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
    return renderChart(chartData);
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
