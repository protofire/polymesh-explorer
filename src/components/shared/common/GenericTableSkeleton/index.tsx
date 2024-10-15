import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
} from '@mui/material';

interface GenericTableSkeletonProps {
  columnCount: number;
  rowCount: number;
}

export function GenericTableSkeleton({
  columnCount,
  rowCount,
}: GenericTableSkeletonProps) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {Array.from({ length: columnCount }, (_, index) => (
              <TableCell key={`header-${index}`}>
                <Skeleton animation="wave" height={20} width="80%" />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rowCount }, (_, rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              {Array.from({ length: columnCount }, (__, cellIndex) => (
                <TableCell key={`cell-${rowIndex}-${cellIndex}`}>
                  <Skeleton animation="wave" height={20} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
