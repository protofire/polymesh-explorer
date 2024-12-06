import React, { useState } from 'react';
import { Box, Typography, List } from '@mui/material';
import { PortfolioWithAssets } from '@/domain/entities/Portfolio';
import { useListPortfolioMovements } from '@/hooks/portfolio/useListPortfolioMovements';
import { PortfoliosTabSkeleton } from './PortfoliosTabSkeleton';
import {
  AssetTypeSelected,
  AssetTypeToggleButton,
} from './AssetTypeToggleButton';
import { GroupedTabsFungibleOrNon } from './GroupedTabsFungibleOrNon';
import { useListPortfolioAssetsTransactions } from '@/hooks/portfolio/useListPortfolioAssetsTransactions';
import { PortfolioAccordionItem } from './PortfolioAccordionItem';

interface PortfoliosTabProps {
  portfolios: PortfolioWithAssets[];
  isLoading?: boolean;
  subscanUrl: string;
}

export function PortfoliosTab({
  portfolios,
  isLoading,
  subscanUrl,
}: PortfoliosTabProps) {
  const [selectedPortfolio, setSelectedPortfolio] =
    useState<PortfolioWithAssets | null>(portfolios[0] || null);
  const [assetType, setAssetType] = useState<AssetTypeSelected>('Fungible');

  const {
    data: portfolioMovements,
    isLoading: isLoadingMovements,
    isFetching: isFetchingMovements,
  } = useListPortfolioMovements({
    portfolioNumber: selectedPortfolio?.id || '',
    type: assetType,
  });

  const {
    data: assetTransactions,
    isLoading: isLoadingTransactions,
    isFetching: isFetchingTransactions,
  } = useListPortfolioAssetsTransactions({
    portfolioId: selectedPortfolio?.id || null,
    nonFungible: assetType === 'NonFungible',
  });

  const handlePortfolioSelect = (portfolio: PortfolioWithAssets) => {
    setSelectedPortfolio(portfolio);
  };

  const handleAssetTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newAssetType: AssetTypeSelected,
  ) => {
    if (newAssetType !== null) {
      setAssetType(newAssetType);
      setSelectedPortfolio(portfolios[0] || null);
    }
  };

  if (isLoading) {
    return <PortfoliosTabSkeleton />;
  }

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Box sx={{ width: '30%', borderRight: 1, borderColor: 'divider', pr: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Portfolios
        </Typography>
        <List>
          {portfolios.map((portfolio) => (
            <PortfolioAccordionItem
              key={portfolio.id}
              portfolio={portfolio}
              isSelected={selectedPortfolio?.id === portfolio.id}
              onSelect={handlePortfolioSelect}
            />
          ))}
        </List>
      </Box>
      <Box sx={{ width: '70%', pl: 2 }}>
        {selectedPortfolio ? (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6">{selectedPortfolio.name}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AssetTypeToggleButton
                  onChange={handleAssetTypeChange}
                  assetType={assetType}
                />
              </Box>
            </Box>
            <GroupedTabsFungibleOrNon
              portfolios={portfolios}
              assetType={assetType}
              selectedPortfolio={selectedPortfolio}
              subscanUrl={subscanUrl}
              portfolioMovements={portfolioMovements}
              isLoadingMovements={isLoadingMovements}
              isFetchingMovements={isFetchingMovements}
              assetTransactions={assetTransactions}
              isLoadingTransactions={isLoadingTransactions}
              isFetchingTransactions={isFetchingTransactions}
            />
          </>
        ) : (
          <Typography>Select a portfolio to view details</Typography>
        )}
      </Box>
    </Box>
  );
}
