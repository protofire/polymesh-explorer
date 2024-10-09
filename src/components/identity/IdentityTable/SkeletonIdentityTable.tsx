import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Typography,
} from '@mui/material';

const SKELETON_ROWS = 10;

export function SkeletonIdentityTable() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom mt={2}>
        <Skeleton width={200} />
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>DID</TableCell>
              <TableCell>Primary Account</TableCell>
              <TableCell>Portfolios</TableCell>
              <TableCell>Claims</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Recent Activity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: SKELETON_ROWS }, (key) => (
              <TableRow key={`skeleton-row-${key}`}>
                <TableCell>
                  <Skeleton width={100} />
                </TableCell>
                <TableCell>
                  <Skeleton width={100} />
                </TableCell>
                <TableCell>
                  <Skeleton width={50} />
                </TableCell>
                <TableCell>
                  <Skeleton width={50} />
                </TableCell>
                <TableCell>
                  <Skeleton width={100} />
                </TableCell>
                <TableCell>
                  <Skeleton width={150} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        mt={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Skeleton width={100} height={40} />
        <Skeleton width={100} height={40} />
      </Box>
      <Box mt={1} textAlign="center">
        <Skeleton width={200} />
      </Box>
    </Box>
  );
}
