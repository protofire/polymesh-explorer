import React, { useMemo } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
} from '@mui/material';
import {
  SubsidyWithAllowance,
  Account,
} from '@polymeshassociation/polymesh-sdk/types';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { BigNumber } from '@polymeshassociation/polymesh-sdk';
import { balanceToBigNumber } from '@polymeshassociation/polymesh-sdk/utils/conversion';
import { Balance } from '@polkadot/types/interfaces';
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';
import { AccountDetails } from '@/domain/entities/Account';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { ROUTES } from '@/config/routes';
import { useLocalPagination } from '@/hooks/useLocalPagination';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';

interface SubsidiesTabProps {
  accountDetails: AccountDetails | null;
  isLoading: boolean;
  error: Error | null;
}

function formatAllowance(allowance: BigNumber): string {
  return balanceToBigNumber(allowance as unknown as Balance).toFormat(6);
}

export function SubsidiesTab({
  accountDetails,
  isLoading,
  error,
}: SubsidiesTabProps) {
  const allSubsidies = useMemo(
    () => [
      ...(accountDetails?.subsidies?.subsidizer
        ? [
            {
              ...accountDetails.subsidies.subsidizer,
              type: 'Subsidizer' as const,
            },
          ]
        : []),
      ...(accountDetails?.subsidies?.beneficiaries.map((beneficiary) => ({
        ...beneficiary,
        type: 'Beneficiary' as const,
      })) || []),
    ],
    [accountDetails?.subsidies],
  );

  const { paginatedItems: paginatedSubsidies, ...paginationController } =
    useLocalPagination(allSubsidies);

  if (isLoading) {
    return <GenericTableSkeleton columnCount={3} rowCount={5} />;
  }

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  const getSubsidyAddress = (
    subsidy: SubsidyWithAllowance['subsidy'],
    type: 'subsidizer' | 'beneficiary',
  ): string => {
    return (subsidy[type] as Account).address;
  };

  const renderSubsidyRow = (
    subsidy: SubsidyWithAllowance,
    type: 'Subsidizer' | 'Beneficiary',
  ) => {
    const keyAddress = getSubsidyAddress(
      subsidy.subsidy,
      type.toLowerCase() as 'subsidizer' | 'beneficiary',
    );

    return (
      <TableRow key={`${type}-${subsidy.subsidy.beneficiary.address}`}>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {type === 'Subsidizer' ? (
              <Chip
                icon={<ArrowUpward />}
                label="Subsidizer"
                color="primary"
                size="small"
              />
            ) : (
              <Chip
                icon={<ArrowDownward />}
                label="Beneficiary"
                color="secondary"
                size="small"
              />
            )}
          </Box>
        </TableCell>
        <TableCell>
          <GenericLink href={`${ROUTES.Account}/${keyAddress}`}>
            {keyAddress}
          </GenericLink>
        </TableCell>
        <TableCell>{formatAllowance(subsidy.allowance)}</TableCell>
      </TableRow>
    );
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Allowance (POLYX)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSubsidies.length > 0 ? (
              paginatedSubsidies.map((subsidy) =>
                renderSubsidyRow(subsidy, subsidy.type),
              )
            ) : (
              <NoDataAvailableTBody
                colSpan={3}
                message="No subsidy information available."
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter paginationController={paginationController} />
    </>
  );
}
