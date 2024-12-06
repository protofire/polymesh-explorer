import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { GenericTabPanel } from '@/components/shared/common/GenericTabPanel';
import { LoadingDot } from '@/components/shared/common/LoadingDotComponent';
import { SettlementInstructionsTab } from '@/components/identity/details/IdentityDetailsTabs/SettlementInstructionsTab';
import { Venue } from '@/domain/entities/Venue';
import { useGetSettlementInstructionsByVenue } from '@/hooks/settlement/useGetSettlementInstructionsByVenue';

interface VenueDetailsTabsProps {
  venue: Venue;
}

export function VenueDetailsTabs({
  venue,
}: VenueDetailsTabsProps): React.ReactElement {
  const [value, setValue] = React.useState(0);

  const { activeInstructions, historicalInstuctions } =
    useGetSettlementInstructionsByVenue({ venueId: venue.id });

  const isLoadingSettlementInstructions =
    !activeInstructions.isFetched || !historicalInstuctions.isFetched;
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab
          label={
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              Settlement instructions
              {isLoadingSettlementInstructions && <LoadingDot />}
            </Box>
          }
        />
      </Tabs>

      <GenericTabPanel
        value={value}
        index={0}
        labelKey="settlement-instructions"
      >
        <SettlementInstructionsTab
          instructions={activeInstructions}
          isLoading={!activeInstructions.isFetched}
          historicalInstructions={historicalInstuctions}
          isLoadingHistorical={!historicalInstuctions.isFetched}
          showVenueId={false}
        />
      </GenericTabPanel>
    </>
  );
}
