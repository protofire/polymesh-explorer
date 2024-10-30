import React from 'react';
import { Tab, Tabs } from '@mui/material';
import { Asset } from '@/domain/entities/Asset';
import { useGetAssetDetails } from '@/hooks/asset/useGetAssetDetails';
import { GeneralInfoTab } from './GeneralInfoTab';
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
        <Tab label="General Info" />
        {/* <Tab label="Holders" />
        <Tab label="Transactions" /> */}
        <Tab label="Documents" />
      </Tabs>

      <GenericTabPanel value={value} index={0} labelKey="overview">
        <GeneralInfoTab
          assetDetails={assetDetails}
          isLoading={status.isLoadingDetails}
          error={error.detailsError || error.sdkClassError}
        />
      </GenericTabPanel>
      {/* <GenericTabPanel value={value} index={1} labelKey="holders">
        <HoldersTab asset={asset} />
      </GenericTabPanel> */}
      {/* <GenericTabPanel value={value} index={2} labelKey="Transactions">
        <TransactionsTab asset={asset} />
      </GenericTabPanel> */}
      <GenericTabPanel value={value} index={3} labelKey="Documents">
        <DocumentsTab
          assetDetails={assetDetails}
          isLoading={status.isLoadingDetails}
          error={error.detailsError || error.sdkClassError}
        />
      </GenericTabPanel>
    </>
  );
}
