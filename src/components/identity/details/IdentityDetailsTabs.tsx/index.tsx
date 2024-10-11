import React, { useState } from 'react';
import { Tabs, Tab, Box, CircularProgress } from '@mui/material';
import { TransactionsTab } from '@/components/identity/TransactionsTab';
import { useTransactionHistoryAccounts } from '@/hooks/identity/useTransactionHistoryAccounts';
import { Identity } from '@/domain/entities/Identity';
import { Portfolio } from '@/domain/entities/Portfolio';
import { AssetTabTable } from './AssetTabTable';
import { PortfoliosTab } from './PortfoliosTab';

interface IdentityDetailsTabsProps {
  identity: Identity;
  identityDid: string;
  subscanUrl: string;
  portfolios: Portfolio[];
  isLoadingPortfolios: boolean;
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
  portfolios,
  isLoadingPortfolios,
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
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Portfolios
                {isLoadingPortfolios && (
                  <CircularProgress size="1rem" sx={{ ml: 1 }} />
                )}
              </Box>
            }
          />
          <Tab label="Transactions" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={isAssetIssuer ? 3 : 2}>
        {transactionData && transactionData[identityDid] && (
          <TransactionsTab
            transactions={transactionData[identityDid].extrinsics}
            subscanUrl={subscanUrl}
          />
        )}
      </TabPanel>
      <TabPanel value={value} index={0}>
        <AssetTabTable assets={heldAssets} />
      </TabPanel>
      <TabPanel value={value} index={isAssetIssuer ? 2 : 1}>
        <PortfoliosTab
          portfolios={portfolios}
          isLoading={isLoadingPortfolios}
        />
      </TabPanel>
      {isAssetIssuer && (
        <TabPanel value={value} index={1}>
          <AssetTabTable assets={ownedAssets} />
        </TabPanel>
      )}
    </Box>
  );
}
