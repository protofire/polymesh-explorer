import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { PortfolioWithAssets } from '@/domain/entities/Portfolio';
import { useListPortfolioMovements } from '@/hooks/portfolio/useListPortfolioMovements';
import { useListAssetTransactions } from '@/hooks/portfolio/useListAssetTransactions';
import { PortfoliosTabSkeleton } from './PortfoliosTabSkeleton';
import {
  AssetTypeSelected,
  AssetTypeToggleButton,
} from './AssetTypeToggleButton';
import { GroupedTabsFungibleOrNon } from './GroupedTabsFungibleOrNon';

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
  console.log('__portfolios')
  // const { data: nftData, isLoading: isLoadingNfts } = useGetIdentityNfts({ identity });

  const {
    data: portfolioMovements,
    isLoading: isLoadingMovements,
    isFetching: isFetchingMovements,
  } = useListPortfolioMovements({
    portfolioNumber: selectedPortfolio?.id || '',
    type: 'Fungible',
  });

  const {
    data: assetTransactions,
    isLoading: isLoadingTransactions,
    isFetching: isFetchingTransactions,
  } = useListAssetTransactions({
    portfolios,
    portfolioId: selectedPortfolio?.id || null,
    nonFungible: false,
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
            <ListItem key={portfolio.id} disablePadding>
              <ListItemButton
                selected={selectedPortfolio?.id === portfolio.id}
                onClick={() => handlePortfolioSelect(portfolio)}
              >
                <ListItemText primary={portfolio.name} />
              </ListItemButton>
            </ListItem>
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
