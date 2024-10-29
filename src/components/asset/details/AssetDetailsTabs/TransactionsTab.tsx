import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Asset } from '@/domain/entities/Asset';

interface TransactionsTabProps {
  asset: Asset;
}

export function TransactionsTab({ asset }: TransactionsTabProps) {
  //   const [selectedVenue, setSelectedVenue] = React.useState('all');

  return (
    <Box p={2}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Asset Transactions on {asset.name}</Typography>
        {/* {asset.allowedVenues && (
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Venue</InputLabel>
            <Select
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
              label="Filter by Venue"
            >
              <MenuItem value="all">All Venues</MenuItem>
              {asset.allowedVenues.map((venue) => (
                <MenuItem key={venue} value={venue}>
                  {venue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )} */}
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell>Venue</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* {asset.transactions?.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>{new Date(tx.timestamp).toLocaleString()}</TableCell>
              <TableCell>
                <AccountOrDidTextField value={tx.from} isIdentity />
              </TableCell>
              <TableCell>
                <AccountOrDidTextField value={tx.to} isIdentity />
              </TableCell>
              <TableCell align="right">{tx.amount}</TableCell>
              <TableCell>{tx.venue}</TableCell>
            </TableRow>
          ))} */}
        </TableBody>
      </Table>
    </Box>
  );
}
