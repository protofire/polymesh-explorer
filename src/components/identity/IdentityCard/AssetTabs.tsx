/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Asset } from '@/domain/entities/Asset';
import Link from 'next/link';

interface AssetTabsProps {
  ownedAssets: Asset[];
  heldAssets: Asset[];
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
      id={`asset-tabpanel-${index}`}
      aria-labelledby={`asset-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function AssetTable({ assets }: { assets: Asset[] }) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Ticker</TableCell>
            <TableCell>Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.map((asset) => (
            <TableRow >
              <TableCell>{asset.name}</TableCell>
              <TableCell>{asset.ticker}</TableCell>
              <TableCell>{asset.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function AssetTabs({ ownedAssets, heldAssets }: AssetTabsProps) {
  const [value, setValue] = useState(0);
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
            <Tab label={`Issued Assets ${ownedAssets.length}`} />
          )}
        </Tabs>
      </Box>
      <TabPanel value={value} index={1}>
        <AssetTable assets={heldAssets} />
      </TabPanel>
      {isAssetIssuer && (
        <TabPanel value={value} index={0}>
          <AssetTable assets={ownedAssets} />
        </TabPanel>
      )}
    </Box>
  );
}
