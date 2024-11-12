import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { ROUTES } from '@/config/routes';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';
import { SettlementLeg } from '@/domain/entities/SettlementInstruction';

interface LegsTableProps {
  legs: SettlementLeg[];
  venueId?: string;
  instructionId: string;
}

export function LegsTabTable({
  legs,
  venueId,
  instructionId,
}: LegsTableProps): React.ReactElement {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sending</TableCell>
            <TableCell>Receiving</TableCell>
            <TableCell>Asset</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {legs.map((leg) => (
            <TableRow key={`leg-${leg.index}-${venueId}-${instructionId}`}>
              <TableCell>
                <AccountOrDidTextField
                  value={leg.from.id}
                  showIdenticon
                  isIdentity
                />
              </TableCell>
              <TableCell>
                <AccountOrDidTextField
                  value={leg.to.id}
                  showIdenticon
                  isIdentity
                />
              </TableCell>
              <TableCell>
                <GenericLink href={`${ROUTES.Asset}/${leg.assetId}`}>
                  {leg.assetId}
                </GenericLink>
              </TableCell>
              <TableCell>{leg.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
