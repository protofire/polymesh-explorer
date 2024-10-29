import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { Asset } from '@/domain/entities/Asset';
import { OverviewTab } from './OverviewTab';
import { HoldersTab } from './HoldersTab';
import { NftMetadataTab } from './NftMetadataTab';
import { IssuerTab } from './IssuerTab';
import { TransactionsTab } from './TransactionsTab';

interface AssetDetailsTabsProps {
  asset: Asset;
}

export function AssetDetailsTabs({ asset }: AssetDetailsTabsProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Overview" />
          <Tab label="Holders" />
          <Tab label="Transactions" />
          {asset.isNftCollection && <Tab label="NFT Metadata" />}
          <Tab label="Issuer" />
        </Tabs>
      </Box>
      {value === 0 && <OverviewTab asset={asset} />}
      {value === 1 && <HoldersTab asset={asset} />}
      {value === 2 && <TransactionsTab asset={asset} />}
      {value === 3 && asset.isNftCollection && <NftMetadataTab asset={asset} />}
      {value === 4 && <IssuerTab asset={asset} />}
    </Box>
  );
}
