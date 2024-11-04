import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { Asset } from '@/domain/entities/Asset';
import { useGetAssetDetails } from '@/hooks/asset/useGetAssetDetails';
import { GeneralInfoTab } from './GeneralInfoTab';
import { DocumentsTab } from './DocumentsTab';
import { GenericTabPanel } from '@/components/shared/common/GenericTabPanel';
import { LoadingDot } from '@/components/shared/common/LoadingDotComponent';
import { useGetAssetHolders } from '@/hooks/asset/useGetAssetHolders';
import { HoldersTab } from './HoldersTab';

interface AssetDetailsTabsProps {
  asset: Asset;
}

export function AssetDetailsTabs({
  asset,
}: AssetDetailsTabsProps): React.ReactElement {
  const [value, setValue] = React.useState(0);
  const { assetDetails, status, error } = useGetAssetDetails(asset);
  const isLoadingDetails = !status.isFetchedDetails || status.isLoadingDetails;
  const { data: assetHolders } = useGetAssetHolders({ asset });

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab
          label={
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              General Info
              {isLoadingDetails && <LoadingDot />}
            </Box>
          }
        />
        <Tab
          label={
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              Holders
              {isLoadingDetails && <LoadingDot />}
            </Box>
          }
        />
        <Tab label="Transactions" />
        <Tab
          label={
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              Documents
              {isLoadingDetails && <LoadingDot />}
            </Box>
          }
        />
      </Tabs>

      <GenericTabPanel value={value} index={0} labelKey="overview">
        <GeneralInfoTab
          assetDetails={assetDetails}
          isLoading={!status.isFetchedDetails || status.isLoadingDetails}
          error={error.detailsError || error.sdkClassError}
        />
      </GenericTabPanel>
      <GenericTabPanel value={value} index={1} labelKey="holders">
        <HoldersTab
          assetHolders={assetHolders}
          asset={asset}
          isLoading={isLoadingDetails}
        />
      </GenericTabPanel>
      {/* <GenericTabPanel value={value} index={2} labelKey="Transactions">
        <TransactionsTab asset={asset} />
      </GenericTabPanel> */}
      <GenericTabPanel value={value} index={3} labelKey="Documents">
        <DocumentsTab
          assetDetails={assetDetails}
          isLoading={!status.isFetchedDetails || status.isLoadingDetails}
          error={error.detailsError || error.sdkClassError}
        />
      </GenericTabPanel>
    </>
  );
}
