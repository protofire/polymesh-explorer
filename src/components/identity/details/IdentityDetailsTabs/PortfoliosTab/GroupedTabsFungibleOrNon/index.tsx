import React, { useState } from 'react';
import { Tabs, Tab } from '@mui/material';
import { GenericTabPanel } from '@/components/shared/common/GenericTabPanel';
import { TabPortfolioAssets } from './TabPortfolioAssets';
import { TabTokenMovementsTable } from './TabTokenMovementsTable';
import { TabAssetTransactionsTable } from './TabAssetTransactionsTable';
import { AssetTypeSelected } from '../AssetTypeToggleButton';
import { PortfolioWithAssets } from '@/domain/entities/Portfolio';
import { UseListPortfolioMovementsReturn } from '@/hooks/portfolio/useListPortfolioMovements';
import { useGetIdentityNfts } from '@/hooks/identity/useGetIdentityNfts';
import { TabNftAssets } from './TabNftAssets';
import { TabNftCollections } from './TabNftCollections';
import { UseListPortfolioAssetsTransactionsReturn } from '@/hooks/portfolio/useListPortfolioAssetsTransactions';

interface GroupedTabsFungibleOrNonProps {
  assetType: AssetTypeSelected;
  selectedPortfolio: PortfolioWithAssets;
  portfolios: PortfolioWithAssets[];
  subscanUrl: string;
  portfolioMovements: UseListPortfolioMovementsReturn | undefined;
  isLoadingMovements: boolean;
  isFetchingMovements: boolean;
  assetTransactions: UseListPortfolioAssetsTransactionsReturn | undefined;
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
      <GenericTabPanel value={selectedTab} index={0} labelKey="portfolioAssets">
        <TabPortfolioAssets assets={selectedPortfolio.assets} />
      </GenericTabPanel>
      <GenericTabPanel
        value={selectedTab}
        index={1}
        labelKey="portfolioAssetsMovements"
      >
        <TabTokenMovementsTable
          subscanUrl={subscanUrl}
          portfolioMovements={portfolioMovements}
          isLoadingMovements={isLoadingMovements}
          isFetchingMovements={isFetchingMovements}
        />
      </GenericTabPanel>
      <GenericTabPanel
        value={selectedTab}
        index={2}
        labelKey="portfolioAssetsTransactions"
      >
        <TabAssetTransactionsTable
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
        <Tab label="Movements" />
        <Tab label="Transactions" />
      </Tabs>
      <GenericTabPanel
        value={selectedTab}
        index={0}
        labelKey="portfolioCollection"
      >
        <TabNftCollections
          selectedPortfolio={selectedPortfolioExtended}
          isLoadingCollections={status.isLoadingCollections}
        />
      </GenericTabPanel>
      <GenericTabPanel value={selectedTab} index={1} labelKey="portfolioNfts">
        <TabNftAssets
          selectedPortfolio={selectedPortfolioExtended}
          isLoadingNfts={status.isLoadingNfts}
        />
      </GenericTabPanel>
      <GenericTabPanel
        value={selectedTab}
        index={2}
        labelKey="portfolioNftMovements"
      >
        <TabTokenMovementsTable
          subscanUrl={subscanUrl}
          portfolioMovements={portfolioMovements}
          isLoadingMovements={isLoadingMovements}
          isFetchingMovements={isFetchingMovements}
          assetType={assetType}
        />
      </GenericTabPanel>
      <GenericTabPanel
        value={selectedTab}
        index={3}
        labelKey="portfolioNftTransactions"
      >
        <TabAssetTransactionsTable
          assetTransactions={assetTransactions}
          isLoadingTransactions={isLoadingTransactions}
          isFetchingTransactions={isFetchingTransactions}
          assetType={assetType}
        />
      </GenericTabPanel>
    </>
  );

  return assetType === 'Fungible' ? fungibleTabs : nonFungibleTabs;
}
