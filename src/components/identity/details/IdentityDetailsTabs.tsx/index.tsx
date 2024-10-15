import React, { useState } from 'react';
import { Tabs, Tab, Box, CircularProgress } from '@mui/material';
import { Identity } from '@/domain/entities/Identity';
import { PortfolioWithAssets } from '@/domain/entities/Portfolio';
import { AssetTabTable } from './AssetTabTable';
import { PortfoliosTab } from './PortfoliosTab';
import { TransactionsTabTable } from './TransactionsTab';
import { CounterBadge } from '@/components/shared/common/CounterBadge';
import { UseTransactionHistoryAccountsReturn } from '@/hooks/identity/useTransactionHistoryAccounts';

interface IdentityDetailsTabsProps {
  identity: Identity;
  subscanUrl: string;
  portfolios: PortfolioWithAssets[];
  isLoadingPortfolios: boolean;
  paginatedTransactions: UseTransactionHistoryAccountsReturn | undefined;
  isLoadingTransactions: boolean;
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
  subscanUrl,
  portfolios,
  isLoadingPortfolios,
  paginatedTransactions,
  isLoadingTransactions,
}: IdentityDetailsTabsProps) {
  const [value, setValue] = useState(0);
  const { ownedAssets, heldAssets } = identity;
  const isAssetIssuer = ownedAssets && ownedAssets.length > 0;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="asset tabs">
          <Tab label="Assets" />
          {isAssetIssuer && (
            <Tab
              label={
                <Box sx={{ paddingRight: '20px' }}>
                  <CounterBadge count={ownedAssets.length}>
                    Issued Assets
                  </CounterBadge>
                </Box>
              }
            />
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
          <Tab label="History" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={isAssetIssuer ? 3 : 2}>
        <TransactionsTabTable
          paginatedTransactions={paginatedTransactions}
          subscanUrl={subscanUrl}
          isLoading={isLoadingTransactions}
        />
      </TabPanel>
      <TabPanel value={value} index={0}>
        <AssetTabTable assets={heldAssets} />
      </TabPanel>
      <TabPanel value={value} index={isAssetIssuer ? 2 : 1}>
        <PortfoliosTab
          portfolios={portfolios}
          isLoading={isLoadingPortfolios}
          subscanUrl={subscanUrl}
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
