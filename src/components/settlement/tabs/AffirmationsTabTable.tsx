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
import { FormattedDate } from '@/components/shared/common/FormattedDateText';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';
import { SettlementInstructionWithEvents } from '@/domain/entities/SettlementInstruction';

interface AffirmationsTableProps {
  affirmations: SettlementInstructionWithEvents['affirmations'];
}

export function AffirmationsTabTable({
  affirmations,
}: AffirmationsTableProps): React.ReactElement {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Identity</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Auto Affirmed</TableCell>
            <TableCell>Is Mediator</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {affirmations.map((affirmation) => (
            <TableRow
              key={`${affirmation.identity}-${affirmation.createdBlockId}`}
            >
              <TableCell>
                <AccountOrDidTextField
                  value={affirmation.identity}
                  showIdenticon
                  isIdentity
                />
              </TableCell>
              <TableCell>{affirmation.status}</TableCell>
              <TableCell>
                <FormattedDate date={affirmation.createdAt} />
              </TableCell>
              <TableCell>
                {affirmation.isAutomaticallyAffirmed ? 'Yes' : 'No'}
              </TableCell>
              <TableCell>{affirmation.isMediator ? 'Yes' : 'No'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
