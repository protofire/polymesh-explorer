import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { Account } from '@polymeshassociation/polymesh-sdk/types';
import { PermissionsTab } from './PermissionsTab';
import { GenericTabPanel } from '@/components/shared/common/GenericTabPanel';
import { SubsidiesTab } from './SubsidiesTab';
import { ExternalLinksTab } from './ExternalLinksTab';

interface AccountDetailsTabsProps {
  account: Account;
  subscanUrl: string;
}

export function AccountDetailsTabs({
  account,
  subscanUrl,
}: AccountDetailsTabsProps) {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="account details tabs"
        >
          <Tab label="Permissions" />
          <Tab label="Subsidies" />
          <Tab label="External Links" />
        </Tabs>
      </Box>
      <GenericTabPanel value={value} index={0} labelKey="account">
        <PermissionsTab account={account} />
      </GenericTabPanel>
      <GenericTabPanel value={value} index={1} labelKey="account">
        <SubsidiesTab account={account} />
      </GenericTabPanel>
      <GenericTabPanel value={value} index={2} labelKey="account">
        <ExternalLinksTab account={account} subscanUrl={subscanUrl} />
      </GenericTabPanel>
    </Box>
  );
}
