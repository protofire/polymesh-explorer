import React, { useState } from 'react';
import { Tabs, Tab, Box, CircularProgress } from '@mui/material';
import { Identity } from '@/domain/entities/Identity';
import { PortfolioWithAssets } from '@/domain/entities/Portfolio';
import { AssetTabTable } from './AssetTabTable';
import { PortfoliosTab } from './PortfoliosTab';
import { TransactionsTabTable } from './TransactionsTab';
import { CounterBadge } from '@/components/shared/common/CounterBadge';
import { UseTransactionHistoryAccountsReturn } from '@/hooks/identity/useTransactionHistoryAccounts';
import { GenericTabPanel } from '@/components/shared/common/GenericTabPanel';
import { SettlementInstructionsTab } from '@/components/identity/details/IdentityDetailsTabs.tsx/SettlementInstructionsTab';
import { GroupedSettlementInstructions } from '@/hooks/settlement/useGetSettlementInstructionsByDid';

interface IdentityDetailsTabsProps {
  identity: Identity;
  subscanUrl: string;
  portfolios: PortfolioWithAssets[];
  isLoadingPortfolios: boolean;
  paginatedTransactions: UseTransactionHistoryAccountsReturn | undefined;
  isLoadingTransactions: boolean;
  settlementInstructions: GroupedSettlementInstructions | null | undefined;
  isLoadingSettlementInstructions: boolean;
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
          <Tab label="Settlement Instructions" />
        </Tabs>
      </Box>
      <GenericTabPanel
        value={value}
        index={isAssetIssuer ? 3 : 2}
        labelKey="identity"
      >
        <TransactionsTabTable
          paginatedTransactions={paginatedTransactions}
          subscanUrl={subscanUrl}
          isLoading={isLoadingTransactions}
        />
      </GenericTabPanel>
      <GenericTabPanel value={value} index={0} labelKey="identity">
        <AssetTabTable assets={heldAssets} />
      </GenericTabPanel>
      <GenericTabPanel
        value={value}
        index={isAssetIssuer ? 2 : 1}
        labelKey="identity"
      >
        <PortfoliosTab
          portfolios={portfolios}
          isLoading={isLoadingPortfolios}
          subscanUrl={subscanUrl}
        />
      </GenericTabPanel>
      {isAssetIssuer && (
        <GenericTabPanel value={value} index={1} labelKey="identity">
          <AssetTabTable assets={ownedAssets} />
        </GenericTabPanel>
      )}
      <GenericTabPanel
        value={value}
        index={isAssetIssuer ? 4 : 3}
        labelKey="identity"
      >
        <SettlementInstructionsTab
          instructions={settlementInstructions}
          isLoading={isLoadingSettlementInstructions}
        />
      </GenericTabPanel>
    </Box>
  );
}
