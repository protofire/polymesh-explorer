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
import { Identity } from '@/domain/entities/Identity';

interface GroupedTabsFungibleOrNonProps {
  assetType: AssetTypeSelected;
  selectedPortfolio: PortfolioWithAssets;
  subscanUrl: string;
  portfolioMovements: UseListPortfolioMovementsReturn | undefined;
  isLoadingMovements: boolean;
  isFetchingMovements: boolean;
  assetTransactions: UseListAssetTransactionsReturn | undefined;
  isLoadingTransactions: boolean;
  isFetchingTransactions: boolean;
  identity: Identity;
}

export function GroupedTabsFungibleOrNon({
  assetType,
  selectedPortfolio,
  subscanUrl,
  portfolioMovements,
  isLoadingMovements,
  isFetchingMovements,
  assetTransactions,
  isLoadingTransactions,
  isFetchingTransactions,
  identity,
}: GroupedTabsFungibleOrNonProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const { data: nftData, isLoading: isLoadingNfts } = useGetIdentityNfts({ identity });

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
        {isLoadingNfts ? (
          <p>Cargando colecciones...</p>
        ) : (
          // Renderizar la lista de colecciones aquí
          <pre>{JSON.stringify(nftData?.collections, null, 2)}</pre>
        )}
      </GenericTabPanel>
      <GenericTabPanel value={selectedTab} index={1} labelKey="portfolio">
        {isLoadingNfts ? (
          <p>Cargando NFTs...</p>
        ) : (
          // Renderizar la lista de NFTs aquí
          <pre>{JSON.stringify(nftData?.assets, null, 2)}</pre>
        )}
      </GenericTabPanel>
    </>
  );

  return assetType === 'Fungible' ? fungibleTabs : nonFungibleTabs;
}
