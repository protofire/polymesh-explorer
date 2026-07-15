import {
  FilterList as FilterIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Box,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { EventIdEnum, Venue } from '@polymeshassociation/polymesh-sdk/types';
import React, { useMemo, useState } from 'react';
import { EmptyDash } from '@/components/shared/common/EmptyDash';
import { FormattedDate } from '@/components/shared/common/FormattedDateText';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';
import { ExportCsvButton } from '@/components/shared/ExportCsvButton';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';
import NftIdsDisplay from '@/components/shared/NftIdsDisplay';
import { ROUTES } from '@/config/routes';
import { Asset } from '@/domain/entities/Asset';
import { Portfolio } from '@/domain/entities/Portfolio';
import { AssetTransactionsCsvExportService } from '@/domain/services/exports/AssetTransactionsCsvExportService';
import { UseGetAssetTransactionsReturn } from '@/hooks/asset/useGetAssetTransactions';
import { CsvExporter } from '@/services/csv/CsvExporter';
import { formatPortfolioPartyLabel } from '@/utils/formatPortfolioPartyLabel';
import { getEventLabel } from './getEventLabel';

function renderTransactionPartyCell({
  account,
  identityId,
  portfolio,
  portfolioId,
}: {
  account?: string;
  identityId?: string;
  portfolio?: Portfolio;
  portfolioId?: string;
}): React.ReactElement {
  if (account) {
    return (
      <AccountOrDidTextField value={account} variant="body2" showIdenticon>
        {account}
      </AccountOrDidTextField>
    );
  }

  if (identityId) {
    return (
      <AccountOrDidTextField
        value={identityId}
        isIdentity
        variant="body2"
        showIdenticon
      >
        {formatPortfolioPartyLabel(identityId, portfolio, portfolioId)}
      </AccountOrDidTextField>
    );
  }

  return <EmptyDash />;
}

interface VenueFilteringStatusProps {
  enabled: boolean;
  allowedVenues: Venue[];
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
              key={venue.id.toString()}
              label={`Venue ${venue.id.toString()}`}
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
  instructionMemo,
  fundingRound,
}: {
  instructionMemo?: string;
  fundingRound?: string;
}): React.ReactElement | null {
  if (!instructionMemo && !fundingRound) return <EmptyDash />;

  return (
    <Tooltip
      title={
        <Stack spacing={1}>
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
  const [, setPage] = useState(0);

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
      transactionsData.map((tx) => tx.venueId).filter(Boolean),
    );
    return Array.from(venues);
  }, [transactionsData]);

  const filteredTransactions = useMemo(() => {
    if (!transactionsData) return [];
    if (selectedVenue === 'all') return transactionsData;
    return transactionsData.filter((tx) => tx.venueId === selectedVenue);
  }, [transactionsData, selectedVenue]);

  const handleExport = () => {
    const csvExporter = new CsvExporter(
      AssetTransactionsCsvExportService.getTransactionColumns(
        asset.isNftCollection,
      ),
    );
    const exportService = new AssetTransactionsCsvExportService(csvExporter);
    exportService.exportTransactions(filteredTransactions, asset);
  };

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
    <>
      <Stack spacing={3} sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Asset Transactions</Typography>
          {uniqueVenues.length > 0 && (
            <Box display="flex" alignItems="center">
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
              <Tooltip title="Filtering applies only to the records shown in the table, not all blockchain transactions.">
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        {venueFiltering?.isEnabled && (
          <VenueFilteringStatus
            enabled={venueFiltering.isEnabled}
            allowedVenues={venueFiltering.allowedVenues}
          />
        )}
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Instruction</TableCell>
              <TableCell>Venue</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell align="right">
                {asset.isNftCollection ? 'Nft Ids' : 'Amount'}
              </TableCell>
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
                const eventInfo = getEventLabel(tx.eventId as EventIdEnum);
                const { fromAccount } = tx;
                const fromDid = tx.fromIdentityId;
                const { toAccount } = tx;
                const toDid = tx.toIdentityId;

                return (
                  <TableRow key={tx.id} hover>
                    <TableCell>
                      {tx.instructionId ? (
                        <GenericLink
                          href={`${ROUTES.Settlement}/${tx.instructionId}`}
                        >
                          {tx.instructionId}
                        </GenericLink>
                      ) : (
                        <EmptyDash />
                      )}
                    </TableCell>
                    <TableCell>
                      {tx.venueId ? (
                        <GenericLink href={`${ROUTES.Venue}/${tx.venueId}`}>
                          {tx.venueId}
                        </GenericLink>
                      ) : (
                        <EmptyDash />
                      )}
                    </TableCell>
                    <TableCell>
                      <FormattedDate date={tx.createdBlock.datetime} />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={eventInfo.label}
                        color={eventInfo.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {renderTransactionPartyCell({
                        account: fromAccount,
                        identityId: fromDid,
                        portfolio: tx.from,
                        portfolioId: tx.fromId,
                      })}
                    </TableCell>
                    <TableCell>
                      {renderTransactionPartyCell({
                        account: toAccount,
                        identityId: toDid,
                        portfolio: tx.to,
                        portfolioId: tx.toId,
                      })}
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                        alignItems="center"
                      >
                        {asset.isNftCollection &&
                        tx.nftIds &&
                        tx.nftIds.length > 0 ? (
                          <NftIdsDisplay
                            nftIds={tx.nftIds}
                            assetId={asset.assetId}
                            maxIdsToShow={3}
                          />
                        ) : (
                          tx.amount
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <TransactionDetailsTooltip
                        instructionMemo={tx.memo}
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
      <PaginationFooter
        paginationController={paginationController}
        leftActions={
          <ExportCsvButton
            onExport={handleExport}
            disabled={filteredTransactions.length === 0}
          />
        }
      />
    </>
  );
}
