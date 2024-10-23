import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
// import { PermissionsTab } from './PermissionsTab';
import { GenericTabPanel } from '@/components/shared/common/GenericTabPanel';
import { Account } from '@/domain/entities/Account';
// import { SubsidiesTab } from './SubsidiesTab';

interface AccountDetailsTabsProps {
  account: Account;
}

export function AccountDetailsTabs({ account }: AccountDetailsTabsProps) {
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
        </Tabs>
      </Box>
      <GenericTabPanel value={value} index={0} labelKey="account">
        {/* <PermissionsTab account={account} /> */}
      </GenericTabPanel>
      <GenericTabPanel value={value} index={1} labelKey="account">
        {/* <SubsidiesTab account={account} /> */}
      </GenericTabPanel>
    </Box>
  );
}
