import React from 'react';
import { Tab, Tabs } from '@mui/material';
import { Asset } from '@/domain/entities/Asset';
import { useGetAssetDetails } from '@/hooks/asset/useGetAssetDetails';
import { OverviewTab } from './OverviewTab';
import { HoldersTab } from './HoldersTab';
import { TransactionsTab } from './TransactionsTab';
import { IssuerTab } from './IssuerTab';
import { DocumentsTab } from './DocumentsTab';
import { GenericTabPanel } from '@/components/shared/common/GenericTabPanel';

interface AssetDetailsTabsProps {
  asset: Asset;
}

export function AssetDetailsTabs({
  asset,
}: AssetDetailsTabsProps): React.ReactElement {
  const [value, setValue] = React.useState(0);
  const { assetDetails, status, error } = useGetAssetDetails(asset);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Overview" />
        <Tab label="Holders" />
        <Tab label="Transactions" />
        <Tab label="Documents" />
        <Tab label="Issuer" />
      </Tabs>

      <GenericTabPanel value={value} index={0} labelKey="overview">
        {/* <OverviewTab
          assetDetails={assetDetails}
          isLoading={status.isLoadingMetadata || status.isLoadingCompliance}
          error={error.metadataError || error.complianceError}
        /> */}
      </GenericTabPanel>
      <GenericTabPanel value={value} index={1} labelKey="holders">
        {/* <HoldersTab asset={asset} /> */}
      </GenericTabPanel>
      <GenericTabPanel value={value} index={2} labelKey="Transactions">
        {/* <TransactionsTab asset={asset} /> */}
      </GenericTabPanel>
      <GenericTabPanel value={value} index={3} labelKey="Documents">
        <DocumentsTab
          assetDetails={assetDetails}
          isLoading={status.isLoadingMetadata}
          error={error.metadataError}
        />
      </GenericTabPanel>
      <GenericTabPanel value={value} index={4} labelKey="Issuer">
        {/* <IssuerTab asset={asset} /> */}
      </GenericTabPanel>
    </>
  );
}
