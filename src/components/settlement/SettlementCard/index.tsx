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
import { RawInstructionNode } from '@/services/repositories/types';

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

  const { id, createdAt, settlementType } = instruction;

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
                hash={rawInstruction?.createdBlock.id.toString() || ''}
              />
            </Box>
          </Box>

          <Box flex={1}>
            <Typography variant="body2" color="textSecondary">
              Created At:
            </Typography>
            {createdAt ? (
              <FormattedDate date={createdAt?.toISOString()} variant="body1" />
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
            <GenericLink href={`${ROUTES.Venue}/${instruction.venueId}`}>
              {instruction.venueId}, {rawInstruction?.venue.details ?? '-'}
            </GenericLink>
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
