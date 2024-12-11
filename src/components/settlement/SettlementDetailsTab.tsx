import React from 'react';
import { Box, Paper, Tab, TableContainer, Tabs } from '@mui/material';
import { GenericTabPanel } from '@/components/shared/common/GenericTabPanel';
import { LoadingDot } from '@/components/shared/common/LoadingDotComponent';
import { SettlementInstructionWithAssets } from '@/domain/entities/SettlementInstruction';
import { LegsTable } from '@/components/shared/settlement/LegsTable';
import { EventsTabTable } from './tabs/EventsTabTable';
import { AffirmationsTabTable } from './tabs/AffirmationsTabTable';
import { useLocalPagination } from '@/hooks/useLocalPagination';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';

interface SettlementDetailsTabProps {
  instruction: SettlementInstructionWithAssets;
  isLoading: boolean;
  subscanUrl: string;
}

export function SettlementDetailsTab({
  instruction,
  isLoading,
  subscanUrl,
}: SettlementDetailsTabProps): React.ReactElement {
  const [value, setValue] = React.useState(0);

  const legsPagination = useLocalPagination(instruction.instructions[0].legs);
  const eventsPagination = useLocalPagination(
    instruction.instructions[0].events,
  );
  const affirmationsPagination = useLocalPagination(
    instruction.instructions[0].affirmations,
  );

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab
          label={
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              Legs
              {isLoading && <LoadingDot />}
            </Box>
          }
        />
        <Tab
          label={
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              Events
              {isLoading && <LoadingDot />}
            </Box>
          }
        />
        <Tab
          label={
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              Affirmations
              {isLoading && <LoadingDot />}
            </Box>
          }
        />
      </Tabs>

      <GenericTabPanel value={value} index={0} labelKey="legs">
        <TableContainer component={Paper}>
          <LegsTable
            legs={legsPagination.paginatedItems}
            tableSize="medium"
            assetsMap={instruction.assetsInvolved}
          />
        </TableContainer>
        <PaginationFooter paginationController={legsPagination} />
      </GenericTabPanel>

      <GenericTabPanel value={value} index={1} labelKey="events">
        <EventsTabTable
          events={eventsPagination.paginatedItems}
          subscanUrl={subscanUrl}
        />
        <PaginationFooter paginationController={eventsPagination} />
      </GenericTabPanel>

      <GenericTabPanel value={value} index={2} labelKey="affirmations">
        <AffirmationsTabTable
          affirmations={affirmationsPagination.paginatedItems}
        />
        <PaginationFooter paginationController={affirmationsPagination} />
      </GenericTabPanel>
    </>
  );
}
