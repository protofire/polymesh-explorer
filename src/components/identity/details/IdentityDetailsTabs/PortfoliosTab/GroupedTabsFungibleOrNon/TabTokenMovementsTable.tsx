import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import { EmptyDash } from '@/components/shared/common/EmptyDash';
import { FormattedDate } from '@/components/shared/common/FormattedDateText';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';
import { PolymeshExplorerLink } from '@/components/shared/ExplorerLink/PolymeshExplorerLink';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';
import { FormattedNumber } from '@/components/shared/fieldAttributes/FormattedNumber';
import { TruncatedPortfolioNameWithTooltip } from '@/components/shared/fieldAttributes/TruncatedPortfolioNameWithTooltip';
import { ROUTES } from '@/config/routes';
import { PortfolioMovement } from '@/domain/entities/PortfolioMovement';
import { PaginatedData } from '@/domain/ui/PaginationInfo';
import { truncateAddress } from '@/services/polymesh/address';
import { removeLeadingZeros } from '@/utils/formatString';
import { AssetTypeSelected } from '../AssetTypeToggleButton';

interface TabTokenMovementsTableProps {
  portfolioMovements: PaginatedData<PortfolioMovement[]> | undefined;
  isLoadingMovements: boolean;
  isFetchingMovements: boolean;
  subscanUrl: string;
  assetType?: AssetTypeSelected;
}

const removeMovementIdPadding = (id: string) => {
  if (!id) return '';
  const [part1, part2] = id.split('/');
  const formattedPart1 = removeLeadingZeros(part1);
  const formattedPart2 = removeLeadingZeros(part2);
  return `${formattedPart1}-${formattedPart2}`;
};

const formatMovementId = (id: string | undefined) => {
  if (!id) return '';
  const unpaddedId = removeMovementIdPadding(id);
  if (unpaddedId.length <= 7) return unpaddedId;

  return `${unpaddedId.slice(0, 3)}...${unpaddedId.slice(-4)}`;
};

function renderMovementFromParty(
  movement: PortfolioMovement,
): React.ReactElement {
  if (movement.fromAccount) {
    return (
      <AccountOrDidTextField value={movement.fromAccount} variant="body2">
        {movement.fromAccount}
      </AccountOrDidTextField>
    );
  }

  if (movement.from) {
    return (
      <>
        <AccountOrDidTextField
          value={movement.from.id}
          isIdentity
          variant="body2"
        >
          {movement.from.id}/{movement.from.number}
        </AccountOrDidTextField>
        {movement.from.name && (
          <TruncatedPortfolioNameWithTooltip text={movement.from.name} />
        )}
      </>
    );
  }

  return <EmptyDash />;
}

function renderMovementToParty(
  movement: PortfolioMovement,
): React.ReactElement {
  if (movement.toAccount) {
    return (
      <AccountOrDidTextField value={movement.toAccount} variant="body2">
        {movement.toAccount}
      </AccountOrDidTextField>
    );
  }

  if (movement.to) {
    return (
      <>
        <AccountOrDidTextField
          value={movement.to.id}
          isIdentity
          variant="body2"
        >
          {movement.to.id}/{movement.to.number}
        </AccountOrDidTextField>
        {movement.to.name && (
          <TruncatedPortfolioNameWithTooltip text={movement.to.name} />
        )}
      </>
    );
  }

  return <EmptyDash />;
}

export function TabTokenMovementsTable({
  portfolioMovements,
  isLoadingMovements,
  isFetchingMovements,
  subscanUrl,
  assetType = 'Fungible',
}: TabTokenMovementsTableProps) {
  if (isLoadingMovements || isFetchingMovements || !portfolioMovements) {
    return <GenericTableSkeleton columnCount={7} rowCount={3} />;
  }

  const isFungible = assetType === 'Fungible';
  const { data: movements, paginationController } = portfolioMovements;

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Asset</TableCell>
              <TableCell>{isFungible ? 'Amount' : 'Nft Id'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movements.length < 1 ? (
              <NoDataAvailableTBody
                message="No portfolio movements available"
                colSpan={6}
              />
            ) : (
              movements.map((movement) => {
                return (
                  <TableRow key={movement.id}>
                    <TableCell>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                          minWidth: '1rem',
                          maxWidth: '8rem',
                        }}
                        gap={0.5}
                      >
                        <Box
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatMovementId(movement.id)}
                        </Box>
                        {movement.id && (
                          <PolymeshExplorerLink
                            baseUrl={subscanUrl}
                            path="extrinsic"
                            hash={removeMovementIdPadding(movement.id)}
                            sx={{
                              '& .MuiSvgIcon-root': {
                                fontSize: '16px',
                                transition: 'color 0.2s',
                              },
                              '&:hover .MuiSvgIcon-root': {
                                color: 'primary.main',
                              },
                            }}
                            toolTipText={`See in subscan extrinsic ${removeMovementIdPadding(movement.id)}`}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <FormattedDate date={movement.createdAt} />
                    </TableCell>
                    <TableCell>{renderMovementFromParty(movement)}</TableCell>
                    <TableCell>{renderMovementToParty(movement)}</TableCell>
                    <TableCell>
                      <GenericLink href={`${ROUTES.Asset}/${movement.assetId}`}>
                        {movement.assetTicker ||
                          truncateAddress(movement.assetId, 4)}
                      </GenericLink>
                    </TableCell>
                    <TableCell>
                      {isFungible
                        ? movement.amount && (
                            <FormattedNumber value={movement.amount} />
                          )
                        : movement.nftIds?.join(', ')}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter paginationController={paginationController} />
    </>
  );
}
