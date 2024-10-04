import React from 'react';
import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material';

export function LoadingSkeletonCard(): React.ReactElement {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Skeleton variant="circular" width={56} height={56} sx={{ mr: 2 }} />
          <Skeleton width="40%" height={40} />
        </Box>
        <Stack spacing={2}>
          {Array.from({ length: 5 }, (_, i) => (
            <Box key={`skeleton-item-${i}`}>
              <Skeleton width="30%" height={20} sx={{ mb: 1 }} />
              <Skeleton
                width={`${Math.floor(Math.random() * 40) + 40}%`}
                height={24}
              />
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
