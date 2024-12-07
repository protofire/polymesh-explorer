import React from 'react';
import { Box, Paper, Tab, TableContainer, Tabs } from '@mui/material';
import { GenericTabPanel } from '@/components/shared/common/GenericTabPanel';
import { LoadingDot } from '@/components/shared/common/LoadingDotComponent';
import { SettlementInstructionWithEvents } from '@/domain/entities/SettlementInstruction';
import { LegsTable } from '@/components/shared/settlement/LegsTable';
import { EventsTabTable } from './tabs/EventsTabTable';
import { AffirmationsTabTable } from './tabs/AffirmationsTabTable';

interface SettlementDetailsTabProps {
  instruction: SettlementInstructionWithEvents;
  isLoading: boolean;
  subscanUrl: string;
}

export function SettlementDetailsTab({
  instruction,
  isLoading,
  subscanUrl,
}: SettlementDetailsTabProps): React.ReactElement {
  const [value, setValue] = React.useState(0);

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
          <LegsTable legs={instruction.legs} tableSize="medium" />
        </TableContainer>
      </GenericTabPanel>

      <GenericTabPanel value={value} index={1} labelKey="events">
        <EventsTabTable events={instruction.events} subscanUrl={subscanUrl} />
      </GenericTabPanel>

      <GenericTabPanel value={value} index={2} labelKey="affirmations">
        <AffirmationsTabTable affirmations={instruction.affirmations} />
      </GenericTabPanel>
    </>
  );
}
