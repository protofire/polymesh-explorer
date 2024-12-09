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
import { AssetTransactionsTab } from './AssetTransactionsTab';
import { useGetAssetTransactions } from '@/hooks/asset/useGetAssetTransactions';
import { AssetPermissionsTab } from './AssetPermissionsTab';
import { useGetAssetPermissions } from '@/hooks/asset/useGetAssetPermissions';
import { ComplianceTab } from './ComplianceTab';

interface AssetDetailsTabsProps {
  asset: Asset;
}

export function AssetDetailsTabs({
  asset,
}: AssetDetailsTabsProps): React.ReactElement {
  const [value, setValue] = React.useState(0);
  const { assetDetails, assetSdk, status, error } = useGetAssetDetails(asset);
  const isLoadingDetails = !status.isFetchedDetails || status.isLoadingDetails;
  const { data: assetHolders } = useGetAssetHolders({ asset });
  const assetTransactionsData = useGetAssetTransactions({
    asset,
    assetSdk,
  });
  const {
    data: assetPermissions,
    isLoading: loadingPermissions,
    isFetched: isFetchedPermissions,
  } = useGetAssetPermissions({
    asset,
    assetSdk,
  });
  const isLoadingPermissions = loadingPermissions || !isFetchedPermissions;

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
        <Tab
          label={
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              Transactions
              {isLoadingDetails && <LoadingDot />}
            </Box>
          }
        />
        <Tab
          label={
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              Documents
              {isLoadingDetails && <LoadingDot />}
            </Box>
          }
        />
        <Tab
          label={
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              Asset Permissions
              {(isLoadingDetails || isLoadingPermissions) && <LoadingDot />}
            </Box>
          }
        />
        <Tab
          label={
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              Compliance Rules
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
      <GenericTabPanel value={value} index={2} labelKey="Transactions">
        <AssetTransactionsTab
          asset={asset}
          assetTransactionsData={assetTransactionsData}
          isLoadingSdkClass={isLoadingDetails}
        />
      </GenericTabPanel>
      <GenericTabPanel value={value} index={3} labelKey="Documents">
        <DocumentsTab
          assetDetails={assetDetails}
          isLoading={!status.isFetchedDetails || status.isLoadingDetails}
          error={error.detailsError || error.sdkClassError}
        />
      </GenericTabPanel>
      <GenericTabPanel value={value} index={4} labelKey="Permissions">
        <AssetPermissionsTab
          assetPermissions={assetPermissions}
          isLoading={isLoadingDetails || isLoadingPermissions}
        />
      </GenericTabPanel>
      <GenericTabPanel value={value} index={5} labelKey="compliance">
        <ComplianceTab assetSdk={assetSdk} isLoading={isLoadingDetails} />
      </GenericTabPanel>
    </>
  );
}
