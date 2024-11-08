import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { SettlementInstruction } from '@/domain/entities/SettlementInstruction';
import { StatusBadge } from '@/components/shared/common/StatusBadge';
import { FormattedDate } from '@/components/shared/common/FormattedDateText';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { ROUTES } from '@/config/routes';
import { LoadingSkeletonCard } from '@/components/shared/LoadingSkeletonCard/LoadingSkeletonCard';
import { DocumentationIconButton } from '@/components/shared/fieldAttributes/DocumentationIconButton';
import CopyButton from '@/components/shared/common/CopyButton';
import { EmptyDash } from '@/components/shared/common/EmptyDash';
import { PolymeshExplorerLink } from '@/components/shared/ExplorerLink/PolymeshExplorerLink';
import { useNetworkProvider } from '@/context/NetworkProvider/useNetworkProvider';
import {
  RawInstructionEvent,
  RawInstructionNode,
} from '@/services/repositories/types';

export function getLastEventDateTime(instruction: RawInstructionNode): string {
  const sortedEvents = [...instruction.events.nodes].sort(
    (a, b) =>
      new Date(b.createdBlock.datetime).getTime() -
      new Date(a.createdBlock.datetime).getTime(),
  );
  return sortedEvents[0]?.createdBlock.datetime;
}

export function getLastEvent(
  instruction: RawInstructionNode,
): RawInstructionEvent | undefined {
  return [...instruction.events.nodes].sort(
    (a, b) =>
      new Date(b.createdBlock.datetime).getTime() -
      new Date(a.createdBlock.datetime).getTime(),
  )[0];
}

export function generateLinkToUse(
  isExecuted: boolean,
  lasEvent: RawInstructionEvent | null | undefined,
  rawInstruction: RawInstructionNode | null | undefined,
): string {
  if (!rawInstruction) return '';

  return isExecuted && lasEvent
    ? `${lasEvent.createdBlock.id.toString()}?tab=event&event=${lasEvent.id.replace('/', '-')}`
    : rawInstruction?.createdBlock.id.toString() || '';
}

interface SettlementCardProps {
  instruction?: SettlementInstruction | undefined;
  rawInstruction: RawInstructionNode | null | undefined;
  isLoading?: boolean;
}

export function SettlementCard({
  instruction,
  rawInstruction,
  isLoading,
}: SettlementCardProps): React.ReactElement {
  const { currentNetworkConfig } = useNetworkProvider();

  if (instruction === undefined || isLoading) {
    return <LoadingSkeletonCard title="Settlement Instrucion" />;
  }

  const { id, createdAt, settlementType, status } = instruction;
  const isExecuted = status === 'Success';
  const lastEventTime = rawInstruction
    ? `${getLastEventDateTime(rawInstruction)}Z`
    : null;
  const lasEvent = rawInstruction ? getLastEvent(rawInstruction) : null;
  const dateToUse = isExecuted ? lastEventTime : createdAt?.toISOString();
  const linkToUse = generateLinkToUse(isExecuted, lasEvent, rawInstruction);

  return (
    <>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Typography variant="h4">Settlement Instruction</Typography>
        <DocumentationIconButton polymeshEntity="settlement" />
      </Box>

      <Stack spacing={2} mb={2}>
        {/* First row */}
        <Stack direction="row" spacing={2}>
          <Box flex={1}>
            <Typography variant="body2" color="textSecondary">
              Instruction ID:
            </Typography>
            <Box display="flex" gap={1} alignItems="center">
              <Typography variant="body1">{id}</Typography>
              <CopyButton text={id} />
              <PolymeshExplorerLink
                baseUrl={currentNetworkConfig?.subscanUrl}
                path="block"
                hash={linkToUse}
              />
            </Box>
          </Box>

          <Box flex={1}>
            <Typography variant="body2" color="textSecondary">
              {status === 'Success' ? 'Execution Date' : 'Created At:'}
            </Typography>
            {dateToUse ? (
              <FormattedDate date={dateToUse} variant="body1" />
            ) : (
              <EmptyDash />
            )}
          </Box>
        </Stack>

        {/* Second row */}
        <Stack direction="row" spacing={2}>
          <Box flex={1}>
            <Typography variant="body2" color="textSecondary">
              Venue:
            </Typography>
            {isExecuted ? (
              <EmptyDash />
            ) : (
              <GenericLink href={`${ROUTES.Venue}/${instruction.venueId}`}>
                {instruction.venueId}, {rawInstruction?.venue.details ?? '-'}
              </GenericLink>
            )}
          </Box>

          <Box flex={1}>
            <Typography variant="body2" color="textSecondary">
              Settlement Type:
            </Typography>
            <Typography variant="body1">{settlementType}</Typography>
          </Box>
        </Stack>
      </Stack>

      {/* Third row */}
      <Stack direction="row" spacing={2}>
        <Box flex={1}>
          <Typography variant="body2" color="textSecondary">
            Counterparties:
          </Typography>
          <Typography>
            {instruction.counterparties} (affirmed by {instruction.affirmedBy})
          </Typography>
        </Box>

        <Box flex={1}>
          <Typography variant="body2" color="textSecondary">
            Status:
          </Typography>
          <StatusBadge
            status={
              instruction.status.toLowerCase() as
                | 'pending'
                | 'affirmed'
                | 'failed'
            }
          />
        </Box>
      </Stack>
    </>
  );
}
