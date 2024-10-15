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
import { Box, Typography } from '@mui/material';

interface ChartData {
  date: string;
  count: number;
}

interface IdentitiesByMonthChartProps {
  chartData: ChartData[];
}

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

export function IdentitiesByMonthChart({
  chartData,
}: IdentitiesByMonthChartProps) {
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
}
