import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { EventIdEnum } from '@polymeshassociation/polymesh-sdk/types';
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';
import { truncateAddress } from '@/services/polymesh/address';
import { AssetTransaction } from '@/domain/entities/AssetTransaction';
import { FormattedDate } from '@/components/shared/common/FormattedDateText';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { ROUTES } from '@/config/routes';
import { PaginatedData } from '@/domain/ui/PaginationInfo';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';
import { FormattedNumber } from '@/components/shared/fieldAttributes/FormattedNumber';
import { AssetTypeSelected } from '../AssetTypeToggleButton';
import { EmptyDash } from '@/components/shared/common/EmptyDash';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';
import { TruncatedPortfolioNameWithTooltip } from '@/components/shared/fieldAttributes/TruncatedPortfolioNameWithTooltip';
import { getEventLabel } from '@/components/asset/details/AssetDetailsTabs/getEventLabel';
import NftIdsDisplay from '@/components/shared/NftIdsDisplay';

interface TabAssetTransactionsTableProps {
  assetTransactions: PaginatedData<AssetTransaction[]> | undefined;
  isLoadingTransactions: boolean;
  isFetchingTransactions: boolean;
  assetType?: AssetTypeSelected;
}

export function TabAssetTransactionsTable({
  assetTransactions,
  isLoadingTransactions,
  isFetchingTransactions,
  assetType = 'Fungible',
}: TabAssetTransactionsTableProps) {
  if (isLoadingTransactions || isFetchingTransactions || !assetTransactions) {
    return <GenericTableSkeleton columnCount={7} rowCount={3} />;
  }
  const isFungible = assetType === 'Fungible';
  const { data: transactions, paginationController } = assetTransactions;

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Instruction</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Asset</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>{isFungible ? 'Amount' : 'Nft Id'}</TableCell>
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => {
                const fromDid = transaction.fromId?.split('/')[0] || '';
                const toDid = transaction.toId?.split('/')[0] || '';
                const eventInfo = getEventLabel(
                  transaction.eventId as EventIdEnum,
                );

                return (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {transaction.instructionId ? (
                        <GenericLink
                          href={`${ROUTES.Settlement}/${transaction.instructionId}`}
                          tooltipText="Open settlement instruction"
                        >
                          {transaction.instructionId}
                        </GenericLink>
                      ) : (
                        <EmptyDash />
                      )}
                    </TableCell>
                    <TableCell>
                      <FormattedDate date={transaction.createdBlock.datetime} />
                    </TableCell>
                    <TableCell>
                      <GenericLink
                        href={`${ROUTES.Asset}/${transaction.assetId}`}
                      >
                        {transaction.assetTicker ||
                          truncateAddress(transaction.assetId, 4)}
                      </GenericLink>
                    </TableCell>
                    <TableCell>
                      {transaction.fromId && (
                        <AccountOrDidTextField
                          value={fromDid}
                          isIdentity
                          variant="body2"
                        >
                          {transaction.fromId}
                        </AccountOrDidTextField>
                      )}
                      {transaction.from?.name && (
                        <TruncatedPortfolioNameWithTooltip
                          text={transaction.from.name}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {transaction.toId && (
                        <AccountOrDidTextField
                          value={toDid}
                          isIdentity
                          variant="body2"
                        >
                          {transaction.toId}
                        </AccountOrDidTextField>
                      )}
                      {transaction.to?.name && (
                        <TruncatedPortfolioNameWithTooltip
                          text={transaction.to.name}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {isFungible
                        ? transaction.amount && (
                            <FormattedNumber value={transaction.amount} />
                          )
                        : transaction.nftIds && (
                            <NftIdsDisplay
                              nftIds={transaction.nftIds}
                              assetId={transaction.assetId}
                              maxIdsToShow={3}
                            />
                          )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={eventInfo.label}
                        color={eventInfo.color}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <NoDataAvailableTBody
                colSpan={6}
                message="No transactions available for this portfolio"
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter paginationController={paginationController} />
    </>
  );
}
