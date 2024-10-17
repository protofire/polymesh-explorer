import React, { useState } from 'react';
import { Tabs, Tab } from '@mui/material';
import { GenericTabPanel } from '@/components/shared/common/GenericTabPanel';
import { TabPortfolioAssets } from './TabPortfolioAssets';
import { TabTokenMovementsTable } from './TabTokenMovementsTable';
import { TabAssetTransactionsTable } from './TabAssetTransactionsTable';
import { AssetTypeSelected } from '../AssetTypeToggleButton';
import { PortfolioWithAssets } from '@/domain/entities/Portfolio';
import { UseListPortfolioMovementsReturn } from '@/hooks/portfolio/useListPortfolioMovements';
import { UseListAssetTransactionsReturn } from '@/hooks/portfolio/useListAssetTransactions';
import { useGetIdentityNfts } from '@/hooks/identity/useGetIdentityNfts';
import { TabNftAssets } from './TabNftAssets';
import { TabNftCollections } from './TabNftCollections';

interface GroupedTabsFungibleOrNonProps {
  assetType: AssetTypeSelected;
  selectedPortfolio: PortfolioWithAssets;
  portfolios: PortfolioWithAssets[];
  subscanUrl: string;
  portfolioMovements: UseListPortfolioMovementsReturn | undefined;
  isLoadingMovements: boolean;
  isFetchingMovements: boolean;
  assetTransactions: UseListAssetTransactionsReturn | undefined;
  isLoadingTransactions: boolean;
  isFetchingTransactions: boolean;
}

export function GroupedTabsFungibleOrNon({
  assetType,
  selectedPortfolio,
  portfolios,
  subscanUrl,
  portfolioMovements,
  isLoadingMovements,
  isFetchingMovements,
  assetTransactions,
  isLoadingTransactions,
  isFetchingTransactions,
}: GroupedTabsFungibleOrNonProps) {
  const [selectedTab, setSelectedTab] = useState(0);

  const { selectedPortfolio: selectedPortfolioExtended, status } =
    useGetIdentityNfts({
      portfolios,
      selectedPortfolio,
    });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const fungibleTabs = (
    <>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        aria-label="portfolio details tabs"
      >
        <Tab label="Assets" />
        <Tab label="Movements" />
        <Tab label="Transactions" />
      </Tabs>
      <GenericTabPanel value={selectedTab} index={0} labelKey="portfolio">
        <TabPortfolioAssets assets={selectedPortfolio.assets} />
      </GenericTabPanel>
      <GenericTabPanel value={selectedTab} index={1} labelKey="portfolio">
        <TabTokenMovementsTable
          subscanUrl={subscanUrl}
          portfolioMovements={portfolioMovements}
          isLoadingMovements={isLoadingMovements}
          isFetchingMovements={isFetchingMovements}
        />
      </GenericTabPanel>
      <GenericTabPanel value={selectedTab} index={2} labelKey="portfolio">
        <TabAssetTransactionsTable
          subscanUrl={subscanUrl}
          assetTransactions={assetTransactions}
          isLoadingTransactions={isLoadingTransactions}
          isFetchingTransactions={isFetchingTransactions}
        />
      </GenericTabPanel>
    </>
  );

  const nonFungibleTabs = (
    <>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        aria-label="portfolio details tabs"
      >
        <Tab label="Collections" />
        <Tab label="NFTs" />
        <Tab label="Transactions" />
        <Tab label="Movements" />
      </Tabs>
      <GenericTabPanel value={selectedTab} index={0} labelKey="portfolio">
        <TabNftCollections
          selectedPortfolio={selectedPortfolioExtended}
          isLoadingCollections={status.isLoadingCollections}
        />
      </GenericTabPanel>
      <GenericTabPanel value={selectedTab} index={1} labelKey="portfolio">
        <TabNftAssets
          selectedPortfolio={selectedPortfolioExtended}
          isLoadingNfts={status.isLoadingNfts}
        />
      </GenericTabPanel>
      <GenericTabPanel value={selectedTab} index={2} labelKey="portfolio">
        <TabAssetTransactionsTable
          subscanUrl={subscanUrl}
          assetTransactions={assetTransactions}
          isLoadingTransactions={isLoadingTransactions}
          isFetchingTransactions={isFetchingTransactions}
          assetType={assetType}
        />
      </GenericTabPanel>
      <GenericTabPanel value={selectedTab} index={3} labelKey="portfolio">
        <TabTokenMovementsTable
          subscanUrl={subscanUrl}
          portfolioMovements={portfolioMovements}
          isLoadingMovements={isLoadingMovements}
          isFetchingMovements={isFetchingMovements}
          assetType={assetType}
        />
      </GenericTabPanel>
    </>
  );

  return assetType === 'Fungible' ? fungibleTabs : nonFungibleTabs;
}
