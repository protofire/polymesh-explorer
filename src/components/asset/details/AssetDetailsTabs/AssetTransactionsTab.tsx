import React, { useState, useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Tooltip,
  IconButton,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  TableContainer,
  Paper,
} from '@mui/material';
import {
  Info as InfoIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { EventIdEnum, Venue } from '@polymeshassociation/polymesh-sdk/types';
import { Asset } from '@/domain/entities/Asset';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';
import { UseGetAssetTransactionsReturn } from '@/hooks/asset/useGetAssetTransactions';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';

interface VenueFilteringStatusProps {
  enabled: boolean;
  allowedVenues: Venue[];
}

function getEventLabel(event: EventIdEnum): {
  label: string;
  color:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';
} {
  switch (event) {
    case 'Issued':
      return { label: 'Issued', color: 'success' };
    case 'Redeemed':
      return { label: 'Redeemed', color: 'error' };
    case 'Transfer':
      return { label: 'Transfer', color: 'primary' };
    default:
      return { label: event, color: 'default' };
  }
}

function VenueFilteringStatus({
  enabled,
  allowedVenues,
}: VenueFilteringStatusProps): React.ReactElement {
  function getFilteringMessage(): React.ReactElement | string {
    if (!enabled) {
      return 'Transactions can occur in any venue.';
    }

    if (allowedVenues.length === 0) {
      return 'No venues are currently allowed for transactions.';
    }

    return (
      <>
        Transactions are restricted to the following venues:{' '}
        <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {allowedVenues.map((venue) => (
            <Chip
              key={venue.toString()}
              label={`Venue ${venue.toString()}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </>
    );
  }

  return (
    <Alert severity={enabled ? 'info' : 'warning'} icon={<FilterIcon />}>
      <AlertTitle>
        Venue Filtering {enabled ? 'Enabled' : 'Disabled'}
      </AlertTitle>
      {getFilteringMessage()}
    </Alert>
  );
}

function TransactionsEmptyState(): React.ReactElement {
  return (
    <Box py={4} display="flex" justifyContent="center" alignItems="center">
      <Typography variant="body2" color="text.secondary">
        No transactions found
      </Typography>
    </Box>
  );
}

function TransactionDetailsTooltip({
  instructionId,
  instructionMemo,
  fundingRound,
}: {
  instructionId?: string;
  instructionMemo?: string;
  fundingRound?: string;
}): React.ReactElement | null {
  if (!instructionId && !instructionMemo && !fundingRound) return null;

  return (
    <Tooltip
      title={
        <Stack spacing={1}>
          {instructionId && (
            <Typography variant="body2">
              Instruction ID: {instructionId}
            </Typography>
          )}
          {instructionMemo && (
            <Typography variant="body2">Memo: {instructionMemo}</Typography>
          )}
          {fundingRound && (
            <Typography variant="body2">
              Funding Round: {fundingRound}
            </Typography>
          )}
        </Stack>
      }
    >
      <IconButton size="small">
        <InfoIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}

function NftTooltip({ nfts }: { nfts: string[] }): React.ReactElement {
  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="subtitle2">NFT IDs:</Typography>
          {nfts.map((id) => (
            <Typography key={id} variant="body2">
              {id}
            </Typography>
          ))}
        </Box>
      }
    >
      <IconButton size="small">
        <InfoIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}

interface TransactionsTabProps {
  asset: Asset;
  assetTransactionsData: UseGetAssetTransactionsReturn;
  isLoadingSdkClass: boolean;
}

export function AssetTransactionsTab({
  asset,
  assetTransactionsData,
  isLoadingSdkClass,
}: TransactionsTabProps): React.ReactElement {
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [page, setPage] = useState(0);

  const {
    transactions: { data: transactionsData },
    venueFiltering: { data: venueFiltering },
    isLoading,
    error,
    paginationController,
  } = assetTransactionsData;

  const uniqueVenues = useMemo(() => {
    if (!transactionsData) return [];
    const venues = new Set(
      transactionsData.map((tx) => tx.venue).filter(Boolean),
    );
    return Array.from(venues);
  }, [transactionsData]);

  const filteredTransactions = useMemo(() => {
    if (!transactionsData) return [];
    if (selectedVenue === 'all') return transactionsData;
    return transactionsData.filter((tx) => tx.venue === selectedVenue);
  }, [transactionsData, selectedVenue]);

  if (isLoading || isLoadingSdkClass) {
    return <GenericTableSkeleton columnCount={7} rowCount={5} />;
  }

  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Error loading transactions</AlertTitle>
        {error.message}
      </Alert>
    );
  }

  return (
    <Stack spacing={3} sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Asset Transactions</Typography>
        {uniqueVenues.length > 0 && (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Venue</InputLabel>
            <Select
              value={selectedVenue}
              onChange={(e) => {
                setSelectedVenue(e.target.value);
                setPage(0);
              }}
              label="Filter by Venue"
            >
              <MenuItem value="all">All Venues</MenuItem>
              {uniqueVenues.map((venue) => (
                <MenuItem key={venue} value={venue}>
                  Venue {venue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {venueFiltering && (
        <VenueFilteringStatus
          enabled={venueFiltering.isEnabled}
          allowedVenues={venueFiltering.allowedVenues}
        />
      )}

      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Venue</TableCell>
                <TableCell align="center">Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <TransactionsEmptyState />
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((tx) => {
                  const eventInfo = getEventLabel(tx.event);
                  return (
                    <TableRow key={tx.transactionId} hover>
                      <TableCell>
                        {new Intl.DateTimeFormat('default', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        }).format(tx.timestamp)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={eventInfo.label}
                          color={eventInfo.color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {tx.from ? (
                          <AccountOrDidTextField value={tx.from} isIdentity />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {tx.to ? (
                          <AccountOrDidTextField value={tx.to} isIdentity />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                          alignItems="center"
                        >
                          {tx.amount}
                          {asset.isNftCollection &&
                            tx.nfts &&
                            tx.nfts.length > 0 && <NftTooltip nfts={tx.nfts} />}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {tx.venue ? (
                          `Venue ${tx.venue}`
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <TransactionDetailsTooltip
                          instructionId={tx.instructionId}
                          instructionMemo={tx.instructionMemo}
                          fundingRound={tx.fundingRound}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <PaginationFooter paginationController={paginationController} />
      </Paper>
    </Stack>
  );
}
