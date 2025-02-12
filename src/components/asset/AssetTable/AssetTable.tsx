'use client';

import React from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
} from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';
import TokenIcon from '@mui/icons-material/Toll';
import { truncateAddress } from '@/services/polymesh/address';
import { ROUTES } from '@/config/routes';
import { Asset } from '@/domain/entities/Asset';
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { FormattedDate } from '@/components/shared/common/FormattedDateText';
import { PaginatedData } from '@/domain/ui/PaginationInfo';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { FormattedNumber } from '@/components/shared/fieldAttributes/FormattedNumber';
import { TruncatedText } from '@/components/shared/fieldAttributes/TruncatedText';
import { AssetTypeToggleButton } from '@/components/identity/details/IdentityDetailsTabs/PortfoliosTab/AssetTypeToggleButton';
import { AssetTokenType } from '@/domain/criteria/AssetCriteria';
import { UseListAssetsReturn } from '@/hooks/asset/useListAssets';
import { ExportCsvButton } from '@/components/shared/ExportCsvButton';
import { CsvExporter } from '@/services/csv/CsvExporter';
import { AssetCsvExportService } from '@/domain/services/exports/AssetCsvExportService';
import { EmptyDash } from '@/components/shared/common/EmptyDash';

interface AssetTableProps {
  paginatedAssets: PaginatedData<Asset[]>;
  criteriaController?: UseListAssetsReturn['criteriaController'];
  error: Error | null;
}

export function AssetTable({
  paginatedAssets,
  criteriaController,
  error,
}: AssetTableProps) {
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;
  if (!criteriaController) return null;

  const { data: assets, paginationController } = paginatedAssets;

  const handleAssetTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newAssetType: AssetTokenType,
  ) => {
    if (newAssetType !== null) {
      criteriaController.setCriteria('assetType', newAssetType);
    }
  };

  const handleExport = () => {
    const csvExporter = new CsvExporter<Asset>(
      AssetCsvExportService.getAssetColumns(),
    );
    const exportService = new AssetCsvExportService(csvExporter);
    exportService.exportAssets(assets);
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <AssetTypeToggleButton
          assetType={criteriaController.criteria.assetType}
          onChange={handleAssetTypeChange}
          includeAllOption
        />
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Ticker or Id</TableCell>
              <TableCell style={{ width: '200px' }}>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Asset Type</TableCell>
              <TableCell>Total Supply</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Holders</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.length > 0 ? (
              assets.map((asset) => (
                <TableRow key={asset.assetId}>
                  <TableCell>
                    <GenericLink href={`${ROUTES.Asset}/${asset.assetId}`}>
                      {asset.ticker || truncateAddress(asset.assetId, 4)}
                    </GenericLink>
                  </TableCell>
                  <TableCell>
                    <TruncatedText
                      text={asset.name}
                      maxLines={2}
                      lineHeight={1.2}
                      maxWidth="100%"
                    />
                  </TableCell>
                  <TableCell>
                    {asset.type ? (
                      <Typography variant="body2">{asset.type}</Typography>
                    ) : (
                      <EmptyDash />
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      title={
                        asset.isNftCollection
                          ? 'NFT Collection'
                          : 'Fungible Token'
                      }
                    >
                      {asset.isNftCollection ? (
                        <CollectionsIcon color="primary" />
                      ) : (
                        <TokenIcon color="secondary" />
                      )}
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <FormattedNumber value={parseFloat(asset.totalSupply)} />
                  </TableCell>
                  <TableCell>
                    <GenericLink
                      href={`${ROUTES.Identity}/${asset.ownerDid}`}
                      tooltipText="Go to Identity"
                    >
                      {truncateAddress(asset.ownerDid, 5)}
                    </GenericLink>
                  </TableCell>
                  <TableCell>{asset.totalHolders}</TableCell>
                  <TableCell>
                    <FormattedDate date={asset.createdAt} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <NoDataAvailableTBody colSpan={8} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter
        paginationController={paginationController}
        leftActions={
          <ExportCsvButton
            onExport={handleExport}
            disabled={assets.length === 0}
          />
        }
      />
    </Box>
  );
}
