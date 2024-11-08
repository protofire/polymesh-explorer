import React from 'react';
import { Box, Skeleton, Typography } from '@mui/material';

export function LoadingSkeletonCard({
  title,
}: {
  title: string;
}): React.ReactElement {
  return (
    <Box>
      {title ? <Typography variant="h4">{title}</Typography> : null}
      <Box display="flex" alignItems="center" mb={2}>
        <Skeleton variant="circular" width={56} height={56} sx={{ mr: 2 }} />
        <Skeleton width="40%" height={40} />
      </Box>
      <Box mt={2}>
        <Skeleton width="60%" />
        <Skeleton width="40%" />
        <Skeleton width="40%" />
      </Box>
    </Box>
  );
}
