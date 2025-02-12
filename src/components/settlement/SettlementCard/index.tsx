import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { SettlementInstructionWithEvents } from '@/domain/entities/SettlementInstruction';
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
import { RawInstructionEvent } from '@/services/repositories/types';

export function getLastEventDateTime(
  instruction: SettlementInstructionWithEvents,
): string {
  const sortedEvents = [...instruction.events].sort(
    (a, b) =>
      new Date(b.createdBlock.datetime).getTime() -
      new Date(a.createdBlock.datetime).getTime(),
  );
  return sortedEvents[0]?.createdBlock.datetime;
}

export function getLastEvent(
  instruction: SettlementInstructionWithEvents,
): RawInstructionEvent | undefined {
  return [...instruction.events].sort(
    (a, b) =>
      new Date(b.createdBlock.datetime).getTime() -
      new Date(a.createdBlock.datetime).getTime(),
  )[0];
}

export function generateLinkToUse(
  isExecuted: boolean,
  lastEvent: RawInstructionEvent | null | undefined,
  instruction: SettlementInstructionWithEvents | null | undefined,
): string {
  if (!instruction) return '';

  return isExecuted && lastEvent
    ? `${lastEvent.createdBlock.blockId}?tab=event&event=${lastEvent.createdBlock.blockId}-${lastEvent.eventIdx}`
    : `${instruction.createdBlock.blockId}?tab=event&event=${instruction.createdBlock.blockId}-${instruction.createdEvent.eventIdx}`;
}

interface SettlementCardProps {
  instruction?: SettlementInstructionWithEvents | undefined;
  isLoading?: boolean;
}

export function SettlementCard({
  instruction,
  isLoading,
}: SettlementCardProps): React.ReactElement {
  const { currentNetworkConfig } = useNetworkProvider();

  if (instruction === undefined || isLoading) {
    return <LoadingSkeletonCard title="Settlement Instruction" />;
  }

  const { id, createdAt, settlementType, isExecuted } = instruction;
  const lastEvent = instruction ? getLastEvent(instruction) : null;
  const linkToUse = generateLinkToUse(isExecuted, lastEvent, instruction);

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
              Created At:
            </Typography>
            {createdAt ? (
              <FormattedDate date={createdAt} variant="body1" />
            ) : (
              <EmptyDash />
            )}
          </Box>

          <Box flex={1}>
            <Typography variant="body2" color="textSecondary">
              Execution Date:
            </Typography>
            {isExecuted && instruction.updatedAt ? (
              <FormattedDate date={instruction.updatedAt} variant="body1" />
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
            {instruction.venueId ? (
              <GenericLink href={`${ROUTES.Venue}/${instruction.venueId}`}>
                {instruction.venueDescription
                  ? `${instruction.venueId}, ${instruction.venueDescription}`
                  : instruction.venueId}
              </GenericLink>
            ) : (
              <EmptyDash />
            )}
          </Box>
          <Box flex={1}>
            <Typography variant="body2" color="textSecondary">
              Settlement Type:
            </Typography>
            <Typography variant="body1">{settlementType}</Typography>
          </Box>
          <Box flex={1} /> {/* Empty space */}
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
        <Box flex={1} /> {/* Empty space */}
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
