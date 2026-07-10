import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { EventIdEnum } from '@polymeshassociation/polymesh-sdk/types';
import React from 'react';
import { getEventLabel } from '@/components/asset/details/AssetDetailsTabs/getEventLabel';
import { EmptyDash } from '@/components/shared/common/EmptyDash';
import { FormattedDate } from '@/components/shared/common/FormattedDateText';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';
import { FormattedNumber } from '@/components/shared/fieldAttributes/FormattedNumber';
import { TruncatedPortfolioNameWithTooltip } from '@/components/shared/fieldAttributes/TruncatedPortfolioNameWithTooltip';
import NftIdsDisplay from '@/components/shared/NftIdsDisplay';
import { ROUTES } from '@/config/routes';
import { AssetTransaction } from '@/domain/entities/AssetTransaction';
import { Portfolio } from '@/domain/entities/Portfolio';
import { PaginatedData } from '@/domain/ui/PaginationInfo';
import { truncateAddress } from '@/services/polymesh/address';
import { AssetTypeSelected } from '../AssetTypeToggleButton';

function formatPortfolioPartyLabel(
  identityId: string,
  portfolio?: Portfolio,
  portfolioId?: string,
): string {
  const portfolioNumber = portfolio?.number ?? portfolioId?.split('/')[1];

  return portfolioNumber !== undefined
    ? `${identityId}/${portfolioNumber}`
    : identityId;
}

function renderTransactionParty({
  account,
  identityId,
  portfolio,
  portfolioId,
  portfolioName,
}: {
  account?: string;
  identityId?: string;
  portfolio?: Portfolio;
  portfolioId?: string;
  portfolioName?: string;
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
      <>
        <AccountOrDidTextField
          value={identityId}
          isIdentity
          variant="body2"
          showIdenticon
        >
          {formatPortfolioPartyLabel(identityId, portfolio, portfolioId)}
        </AccountOrDidTextField>
        {portfolioName && (
          <TruncatedPortfolioNameWithTooltip text={portfolioName} />
        )}
      </>
    );
  }

  return <EmptyDash />;
}

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
                const { fromAccount } = transaction;
                const fromDid = transaction.fromIdentityId;
                const { toAccount } = transaction;
                const toDid = transaction.toIdentityId;
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
                      {renderTransactionParty({
                        account: fromAccount,
                        identityId: fromDid,
                        portfolio: transaction.from,
                        portfolioId: transaction.fromId,
                        portfolioName: transaction.from?.name,
                      })}
                    </TableCell>
                    <TableCell>
                      {renderTransactionParty({
                        account: toAccount,
                        identityId: toDid,
                        portfolio: transaction.to,
                        portfolioId: transaction.toId,
                        portfolioName: transaction.to?.name,
                      })}
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
