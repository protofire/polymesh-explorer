import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { PermissionsTab } from './PermissionsTab';
import { SubsidiesTab } from './SubsidiesTab';
import { UseGetAccountDetailsReturn } from '@/hooks/account/useGetAccountDetails';
import { AccountDetails } from '@/domain/entities/Account';

interface AccountDetailsTabsProps {
  accountDetails: AccountDetails | null;
  status: UseGetAccountDetailsReturn['status'];
  error: UseGetAccountDetailsReturn['error'];
}

export function AccountDetailsTabs({
  accountDetails,
  status,
  error,
}: AccountDetailsTabsProps) {
  const [tabSelected, setTabSelected] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabSelected(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabSelected}
          onChange={handleChange}
          aria-label="account details tabs"
        >
          <Tab label="Permissions" />
          <Tab label="Subsidies" />
        </Tabs>
      </Box>
      <Box sx={{ p: 3 }}>
        {tabSelected === 0 && (
          <PermissionsTab
            accountDetails={accountDetails}
            isLoading={
              !status.isFetchedPermissions || status.isLoadingPermissions
            }
            error={error.permissionsError}
          />
        )}
        {tabSelected === 1 && (
          <SubsidiesTab
            accountDetails={accountDetails}
            isLoading={!status.isFetchedSubsidies || status.isLoadingSubsidies}
            error={error.subsidiesError}
          />
        )}
      </Box>
    </Box>
  );
}
