import React from 'react';
import { Box, Typography, Skeleton, Stack } from '@mui/material';

export function IdentityCardSkeleton(): React.ReactElement {
  return (
    <>
      <Typography variant="h4">Identity</Typography>
      <Box display="flex" alignItems="center" mt={2}>
        <Skeleton
          variant="circular"
          width={42}
          height={42}
          style={{ marginRight: '16px' }}
        />
        <Box display="flex" flexDirection="column">
          <Skeleton variant="text" width={30} />
          <Skeleton variant="text" width={200} />
        </Box>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mt={2}
      >
        <Box>
          <Skeleton variant="text" width={80} />
          <Skeleton variant="text" width={120} />
        </Box>
        <Box>
          <Skeleton variant="text" width={100} />
          <Skeleton variant="text" width={150} />
        </Box>
        <Skeleton variant="rectangular" width={100} height={36} />
      </Box>
      <Stack direction="row" spacing={2} mt={4} mb={2}>
        {Array.from({ length: 4 }, (_, index) => (
          <Box key={`skeleton-item-${index}`} width="25%">
            <Skeleton variant="text" width={60} />
            <Skeleton variant="text" width={40} height={40} />
          </Box>
        ))}
      </Stack>
    </>
  );
}
