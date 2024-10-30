import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { Identity } from '@/domain/entities/Identity';
import { Portfolio } from '@/domain/entities/Portfolio';
import { PortfoliosTab } from './PortfoliosTab';
import { TransactionsTab } from './TransactionsTab';
import { SettlementInstructionsTab } from './SettlementInstructionsTab';
import { AssetPermissionsTab } from './AssetPermissionsTab';
import { PaginatedTransactionHistory } from '@/hooks/identity/useTransactionHistoryAccounts';
import { PaginatedResult } from '@/hooks/usePaginationControllerGraphQl';
import { SettlementInstruction } from '@/domain/entities/SettlementInstruction';
import { AssetPermissions } from '@/types/asset';

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface IdentityDetailsTabsProps {
  identity: Identity;
  subscanUrl: string;
  portfolios: Portfolio[];
  isLoadingPortfolios: boolean;
  paginatedTransactions?: PaginatedTransactionHistory;
  isLoadingTransactions: boolean;
  settlementInstructions?: PaginatedResult<SettlementInstruction>;
  isLoadingSettlementInstructions: boolean;
  assetPermissions?: AssetPermissions[];
  isLoadingAssetPermissions: boolean;
}

export function IdentityDetailsTabs({
  identity,
  subscanUrl,
  portfolios,
  isLoadingPortfolios,
  paginatedTransactions,
  isLoadingTransactions,
  settlementInstructions,
  isLoadingSettlementInstructions,
  assetPermissions,
  isLoadingAssetPermissions,
}: IdentityDetailsTabsProps): React.ReactElement {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="identity details tabs"
        >
          <Tab label="Portfolios" {...a11yProps(0)} />
          <Tab label="Transactions" {...a11yProps(1)} />
          <Tab label="Settlement Instructions" {...a11yProps(2)} />
          <Tab label="Asset Permissions" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <PortfoliosTab
          portfolios={portfolios}
          isLoading={isLoadingPortfolios}
          identity={identity}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TransactionsTab
          paginatedTransactions={paginatedTransactions}
          isLoading={isLoadingTransactions}
          subscanUrl={subscanUrl}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <SettlementInstructionsTab
          settlementInstructions={settlementInstructions}
          isLoading={isLoadingSettlementInstructions}
        />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <AssetPermissionsTab
          assetPermissions={assetPermissions}
          isLoading={isLoadingAssetPermissions}
        />
      </TabPanel>
    </Box>
  );
}
