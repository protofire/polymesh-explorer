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
import { Portfolio } from '@/domain/entities/Portfolio';
import { PortfoliosTabSkeleton } from './PortfoliosTabSkeleton';

interface PortfoliosTabProps {
  portfolios: Portfolio[];
  isLoading?: boolean;
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
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export function PortfoliosTab({ portfolios, isLoading }: PortfoliosTabProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    portfolios[0] || null,
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handlePortfolioSelect = (portfolio: Portfolio) => {
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
            </Tabs>
            <TabPanel value={selectedTab} index={0}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Ticker</TableCell>
                      <TableCell>Total Supply</TableCell>
                      <TableCell>Asset Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedPortfolio.assets.map((asset) => (
                      <TableRow key={asset.ticker}>
                        <TableCell>{asset.name}</TableCell>
                        <TableCell>{asset.ticker}</TableCell>
                        <TableCell>{asset.balance}</TableCell>
                        <TableCell>{asset.type}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
              <Typography>Portfolio Movements (To be implemented)</Typography>
            </TabPanel>
          </>
        ) : (
          <Typography>Select a portfolio to view details</Typography>
        )}
      </Box>
    </Box>
  );
}
