import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { AssetTable } from '@/components/identity/AssetTabs';
import { TransactionsTab } from '@/components/identity/TransactionsTab';
import { useTransactionHistoryAccounts } from '@/hooks/identity/useTransactionHistoryAccounts';
import { Identity } from '@/domain/entities/Identity';
import { PortfoliosTab } from './PortfoliosTab';

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
      // eslint-disable-next-line react/jsx-props-no-spreading
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

  // Sample portfolios for testing
  const samplePortfolios = [
    {
      id: '1',
      name: 'Portfolio 1',
      assets: [
        { ticker: 'ASSET1', name: 'Asset One', type: 'Equity' },
        { ticker: 'ASSET2', name: 'Asset Two', type: 'Bond' },
      ],
    },
    {
      id: '2',
      name: 'Portfolio 2',
      assets: [
        { ticker: 'ASSET3', name: 'Asset Three', type: 'Commodity' },
        { ticker: 'ASSET4', name: 'Asset Four', type: 'Currency' },
      ],
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="asset tabs">
          <Tab label="Assets" />
          {isAssetIssuer && (
            <Tab label={`Issued Assets ${ownedAssets.length}`} />
          )}
          <Tab label="Portfolios" />
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
        <PortfoliosTab portfolios={samplePortfolios} />
      </TabPanel>
      <TabPanel value={value} index={isAssetIssuer ? 3 : 2}>
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
