import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { ROUTES } from '@/config/routes';
import { EmptyDash } from '@/components/shared/common/EmptyDash';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';
import {
  SettlementLegDirectionField,
  SettlementLegDirectionFieldProps,
} from '@/components/shared/common/SettlementLegDirectionField';
import { SettlementLeg } from '@/domain/entities/SettlementInstruction';

interface LegsTableProps {
  legs: SettlementLeg[];
  currentIdentityDid?: string;
  tableSize?: 'small' | 'medium';
}

export function LegsTable({
  legs,
  currentIdentityDid,
  tableSize = 'small',
}: LegsTableProps) {
  return (
    <Table size={tableSize}>
      <TableHead>
        <TableRow>
          {currentIdentityDid && <TableCell>Direction</TableCell>}
          <TableCell>Sending Portfolio</TableCell>
          <TableCell>Receiving Portfolio</TableCell>
          <TableCell>Asset</TableCell>
          <TableCell>Amount</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {legs.map((leg: SettlementLeg) => {
          let direction:
            | SettlementLegDirectionFieldProps['direction']
            | undefined;

          if (currentIdentityDid) {
            direction =
              leg.from.id === currentIdentityDid ? 'Sending' : 'Receiving';
          }

          return (
            <TableRow key={`leg-${leg.index}`}>
              {currentIdentityDid && (
                <TableCell>
                  {typeof direction !== 'undefined' ? (
                    <SettlementLegDirectionField direction={direction} />
                  ) : (
                    <EmptyDash />
                  )}
                </TableCell>
              )}
              <TableCell>
                <AccountOrDidTextField
                  value={leg.from.id}
                  isIdentity
                  variant="body2"
                  showIdenticon
                >
                  {`${leg.from.id}/${leg.from.number}`}
                </AccountOrDidTextField>
              </TableCell>
              <TableCell>
                <AccountOrDidTextField
                  value={leg.to.id}
                  isIdentity
                  variant="body2"
                  showIdenticon
                >
                  {`${leg.to.id}/${leg.to.number}`}
                </AccountOrDidTextField>
              </TableCell>
              <TableCell>
                <GenericLink href={`${ROUTES.Asset}/${leg.assetId}`}>
                  {leg.assetId}
                </GenericLink>
              </TableCell>
              <TableCell>{leg.amount}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
