import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { Identity } from '@/domain/entities/Identity';
import { PortfolioWithAssets } from '@/domain/entities/Portfolio';
import { PortfoliosTab } from './PortfoliosTab';
import { SettlementInstructionsTab } from './SettlementInstructionsTab';
import { IdentityAssetPermissionsTab } from './IdentityAssetPermissionsTab';
import { GenericTabPanel } from '@/components/shared/common/GenericTabPanel';
import { CounterBadge } from '@/components/shared/common/CounterBadge';
import { AssetTabTable } from './AssetTabTable';
import { UseTransactionHistoryAccountsReturn } from '@/hooks/identity/useTransactionHistoryAccounts';
import { GroupedSettlementInstructions } from '@/hooks/settlement/useGetSettlementInstructionsByOwner';
import { AssetPermissions } from '@/domain/entities/AssetPermissions';
import { LoadingDot } from '@/components/shared/common/LoadingDotComponent';
import { HistoryTransactionsTabTable } from './HistoryTransactionsTab';

interface IdentityDetailsTabsProps {
  identity: Identity;
  subscanUrl: string;
  portfolios: PortfolioWithAssets[];
  isLoadingPortfolios: boolean;
  paginatedTransactions: UseTransactionHistoryAccountsReturn | undefined;
  isLoadingTransactions: boolean;
  settlementInstructions: GroupedSettlementInstructions | null | undefined;
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
  const { ownedAssets, heldAssets } = identity;
  const isAssetIssuer = ownedAssets && ownedAssets.length > 0;

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
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
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                Portfolios
                {isLoadingPortfolios && <LoadingDot />}
              </Box>
            }
          />
          <Tab label="History" />
          <Tab
            label={
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                Settlement Instructions
                {isLoadingSettlementInstructions && <LoadingDot />}
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                Assets Permissions
                {isLoadingAssetPermissions && <LoadingDot />}
              </Box>
            }
          />
        </Tabs>
      </Box>
      <GenericTabPanel value={value} index={0} labelKey="identity-assets">
        <AssetTabTable assets={heldAssets} />
      </GenericTabPanel>
      {isAssetIssuer && (
        <GenericTabPanel value={value} index={1} labelKey="issued-assets">
          <AssetTabTable assets={ownedAssets} />
        </GenericTabPanel>
      )}
      <GenericTabPanel
        value={value}
        index={isAssetIssuer ? 2 : 1}
        labelKey="identity-portfolios"
      >
        <PortfoliosTab
          portfolios={portfolios}
          isLoading={isLoadingPortfolios}
          subscanUrl={subscanUrl}
        />
      </GenericTabPanel>
      <GenericTabPanel
        value={value}
        index={isAssetIssuer ? 3 : 2}
        labelKey="identity-transactions-history"
      >
        <HistoryTransactionsTabTable
          paginatedTransactions={paginatedTransactions}
          subscanUrl={subscanUrl}
          isLoading={isLoadingTransactions}
        />
      </GenericTabPanel>
      <GenericTabPanel
        value={value}
        index={isAssetIssuer ? 4 : 3}
        labelKey="identity-settlement-instructions"
      >
        <SettlementInstructionsTab
          instructions={settlementInstructions}
          isLoading={isLoadingSettlementInstructions}
        />
      </GenericTabPanel>
      <GenericTabPanel
        value={value}
        index={isAssetIssuer ? 5 : 4}
        labelKey="asset-permissions"
      >
        <IdentityAssetPermissionsTab
          assetPermissions={assetPermissions}
          isLoading={isLoadingAssetPermissions}
        />
      </GenericTabPanel>
    </Box>
  );
}
