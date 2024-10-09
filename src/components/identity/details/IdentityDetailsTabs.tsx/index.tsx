/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { AssetTable } from '@/components/identity/AssetTabs';
import { TransactionsTab } from '@/components/identity/TransactionsTab';
import { useTransactionHistoryAccounts } from '@/hooks/identity/useTransactionHistoryAccounts';
import { Identity } from '@/domain/entities/Identity';

interface IdentityDetailsTabsProps {
  identity: Identity;
  identityDid: string;
  subscanUrl: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`asset-tabpanel-${index}`}
      aria-labelledby={`asset-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export function IdentityDetailsTabs({
  identity,
  identityDid,
  subscanUrl,
}: IdentityDetailsTabsProps) {
  const [value, setValue] = useState(0);
  const { ownedAssets, heldAssets } = identity;
  const isAssetIssuer = ownedAssets && ownedAssets.length > 0;

  const { data: transactionData } = useTransactionHistoryAccounts([identity]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="asset tabs">
          <Tab label="Assets" />
          {isAssetIssuer && (
            <Tab label={`Issued Assets ${ownedAssets.length}`} />
          )}
          <Tab label="Transactions" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <AssetTable assets={heldAssets} />
      </TabPanel>
      {isAssetIssuer && (
        <TabPanel value={value} index={1}>
          <AssetTable assets={ownedAssets} />
        </TabPanel>
      )}
      <TabPanel value={value} index={isAssetIssuer ? 2 : 1}>
        {transactionData && transactionData[identityDid] && (
          <TransactionsTab
            transactions={transactionData[identityDid].extrinsics}
            subscanUrl={subscanUrl}
          />
        )}
      </TabPanel>
    </Box>
  );
}
