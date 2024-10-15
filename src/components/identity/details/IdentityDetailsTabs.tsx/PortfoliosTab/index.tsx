import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
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
import { TabTokenMovementsTable } from './TabTokenMovementsTable';
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { TabAssetTransactionsTable } from './TabAssetTransactionsTable';

interface PortfoliosTabProps {
  portfolios: PortfolioWithAssets[];
  isLoading?: boolean;
  subscanUrl: string;
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
      id={`portfolio-tabpanel-${index}`}
      aria-labelledby={`portfolio-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export function PortfoliosTab({
  portfolios,
  isLoading,
  subscanUrl,
}: PortfoliosTabProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioWithAssets | null>(portfolios[0] || null);

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handlePortfolioSelect = (portfolio: PortfolioWithAssets) => {
    setSelectedPortfolio(portfolio);
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
            <Typography variant="h6" sx={{ mb: 2 }}>
              {selectedPortfolio.name}
            </Typography>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              aria-label="portfolio details tabs"
            >
              <Tab label="Assets" />
              <Tab label="Movements" />
              <Tab label="Transactions" />
            </Tabs>
            <TabPanel value={selectedTab} index={0}>
              <TableContainer component={Paper} sx={{ minHeight: '15rem' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Ticker</TableCell>
                      <TableCell>Balance</TableCell>
                      <TableCell>Asset Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedPortfolio.assets.length > 0 ? (
                      selectedPortfolio.assets.map((asset) => (
                        <TableRow key={asset.ticker}>
                          <TableCell>{asset.name}</TableCell>
                          <TableCell>{asset.ticker}</TableCell>
                          <TableCell>{asset.balance}</TableCell>
                          <TableCell>{asset.type}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <NoDataAvailableTBody
                        colSpan={4}
                        message="No assets available for this portfolio"
                      />
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
              <TabTokenMovementsTable
                subscanUrl={subscanUrl}
                portfolioMovements={portfolioMovements}
                isLoadingMovements={isLoadingMovements}
                isFetchingMovements={isFetchingMovements}
              />
            </TabPanel>
            <TabPanel value={selectedTab} index={2}>
              <TabAssetTransactionsTable
                subscanUrl={subscanUrl}
                assetTransactions={assetTransactions}
                isLoadingTransactions={isLoadingTransactions}
                isFetchingTransactions={isFetchingTransactions}
              />
            </TabPanel>
          </>
        ) : (
          <Typography>Select a portfolio to view details</Typography>
        )}
      </Box>
    </Box>
  );
}
