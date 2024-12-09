import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { GenericTabPanel } from '@/components/shared/common/GenericTabPanel';
import { LoadingDot } from '@/components/shared/common/LoadingDotComponent';
import { SettlementInstructionsTab } from '@/components/identity/details/IdentityDetailsTabs/SettlementInstructionsTab';
import { SignersTab } from './SignersTab/SignersTab';
import { Venue } from '@/domain/entities/Venue';
import { useGetSettlementInstructionsByVenue } from '@/hooks/settlement/useGetSettlementInstructionsByVenue';
import { useGetVenueSigners } from '@/hooks/venue/useGetVenueSigners';

interface VenueDetailsTabsProps {
  venue: Venue;
}

export function VenueDetailsTabs({
  venue,
}: VenueDetailsTabsProps): React.ReactElement {
  const [value, setValue] = React.useState(0);

  const { activeInstructions, historicalInstuctions } =
    useGetSettlementInstructionsByVenue({ venueId: venue.id });
  const {
    data: signers,
    isLoading: isLoadingSigners,
    error: errorSigners,
  } = useGetVenueSigners(venue);

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
        <Tab
          label={
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              Allowed Signers
              {isLoadingSigners && <LoadingDot />}
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

      <GenericTabPanel value={value} index={1} labelKey="venue-signers">
        <SignersTab
          signers={signers}
          isLoading={isLoadingSigners}
          error={errorSigners}
        />
      </GenericTabPanel>
    </>
  );
}
