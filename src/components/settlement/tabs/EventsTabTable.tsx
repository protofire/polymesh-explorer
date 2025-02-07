import React, { useMemo } from 'react';
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
import { RawInstructionEvent } from '@/services/repositories/types';
import { truncateAddress } from '@/services/polymesh/address';
import CopyButton from '@/components/shared/common/CopyButton';
import { PolymeshExplorerLink } from '@/components/shared/ExplorerLink/PolymeshExplorerLink';
import { buildLinkFromEvent } from '../buildLinkFromEvent';

interface EventsTableProps {
  events: RawInstructionEvent[];
  subscanUrl: string;
}

export function EventsTabTable({
  events,
  subscanUrl,
}: EventsTableProps): React.ReactElement {
  const sortedEvents = useMemo(
    () =>
      events.sort(
        (a, b) =>
          new Date(`${b.createdBlock.datetime}Z`).getTime() -
          new Date(`${a.createdBlock.datetime}Z`).getTime(),
      ),
    [events],
  );

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Event</TableCell>
            <TableCell>Event ID</TableCell>
            <TableCell>Block Hash</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedEvents.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <FormattedDate date={event.createdBlock.datetime} />
              </TableCell>
              <TableCell>{event.event}</TableCell>
              <TableCell>
                {event.createdBlock.blockId}-{event.eventIdx}
                <PolymeshExplorerLink
                  baseUrl={subscanUrl}
                  path="block"
                  hash={buildLinkFromEvent(event, true)}
                />
              </TableCell>
              <TableCell>
                <>
                  {truncateAddress(event.createdBlock.hash)}
                  <CopyButton text={event.createdBlock.hash} />
                </>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
