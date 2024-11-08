import React from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { UseGetVenueReturn, VenueDetails } from '@/hooks/venue/useGetVenue';
import { GenericTabPanel } from '@/components/shared/common/GenericTabPanel';
import { LoadingDot } from '@/components/shared/common/LoadingDotComponent';
import { SettlementInstructionsTab } from '@/components/identity/details/IdentityDetailsTabs/SettlementInstructionsTab';

interface VenueDetailsTabsProps {
  venue: VenueDetails;
  status: UseGetVenueReturn['status'];
  error: UseGetVenueReturn['error'];
}

export function VenueDetailsTabs({
  venue,
  status,
  error,
}: VenueDetailsTabsProps): React.ReactElement {
  const [value, setValue] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (error.getVenueInstructionsError) {
    return (
      <Box mt={2}>
        <Typography>Error: {String(error.getVenueError)}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab
          label={
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              Settlement instructions
              {status.isLoadingVenueInstructions && <LoadingDot />}
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
          instructions={venue?.instructions}
          isLoading={!status.isFetchedVenueInstructions}
        />
      </GenericTabPanel>
    </>
  );
}
