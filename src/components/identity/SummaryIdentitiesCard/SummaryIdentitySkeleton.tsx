import React from 'react';
import { Box, Card, CardContent, Skeleton } from '@mui/material';

export function SummaryIdentitySkeleton(): React.ReactElement {
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
          <Skeleton variant="text" width="60%" height={30} />
          <Skeleton variant="rectangular" height={200} />
        </CardContent>
      </Card>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Skeleton variant="text" width="80%" height={30} />
            <Skeleton variant="text" width="50%" height={60} />
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Skeleton variant="text" width="80%" height={30} />
            <Skeleton variant="text" width="50%" height={60} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
