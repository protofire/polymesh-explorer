import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from '@mui/material';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { RowInstruction } from './RowInstruction';
import { SettlementInstructionTypeToggle } from './SettlementInstructionTypeToggle';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';
import { Identity } from '@/domain/entities/Identity';
import { UseGetSettlementInstructionsReturn } from '@/hooks/settlement/useGetSettlementInstructionsByDid';
import { SettlementInstructionToggleOption } from '@/domain/ui/SettlementInstructionToggleOptoin';

interface SettlementInstructionsTabProps {
  instructions:
    | UseGetSettlementInstructionsReturn['activeInstructions']
    | undefined;
  historicalInstructions:
    | UseGetSettlementInstructionsReturn['historicalInstuctions']
    | undefined;
  isLoading: boolean;
  isLoadingHistorical: boolean;
  currentIdentityDid?: Identity['did'];
}

export function SettlementInstructionsTab({
  instructions,
  isLoading,
  historicalInstructions,
  isLoadingHistorical,
  currentIdentityDid,
}: SettlementInstructionsTabProps) {
  const [instructionType, setInstructionType] =
    useState<SettlementInstructionToggleOption>('Current');

  const handleInstructionTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: SettlementInstructionToggleOption | null,
  ) => {
    if (newValue !== null) {
      setInstructionType(newValue);
    }
  };

  const selectedInstructions =
    instructionType === 'Current' ? instructions : historicalInstructions;
  const isLoadingCurrent =
    instructionType === 'Current' ? isLoading : isLoadingHistorical;

  if (isLoadingCurrent || selectedInstructions === undefined) {
    return <GenericTableSkeleton columnCount={7} rowCount={8} />;
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <SettlementInstructionTypeToggle
          value={instructionType}
          onChange={handleInstructionTypeChange}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Instruction ID</TableCell>
              <TableCell>Venue ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell># Counterparties</TableCell>
              <TableCell>Settlement Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedInstructions.data &&
            selectedInstructions.data.length > 0 ? (
              selectedInstructions.data.map((instruction) => (
                <RowInstruction
                  key={`${instruction.status}-${instruction.id}`}
                  instruction={instruction}
                  currentIdentityDid={currentIdentityDid}
                />
              ))
            ) : (
              <NoDataAvailableTBody
                colSpan={7}
                message={`No ${instructionType.toLowerCase()} settlement instructions found.`}
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter
        paginationController={selectedInstructions.paginationController}
      />
    </>
  );
}
