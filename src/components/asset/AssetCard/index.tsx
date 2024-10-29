import React from 'react';
import { Box, Typography, Stack, Skeleton } from '@mui/material';
import Identicon from '@polkadot/ui-identicon';
import { Asset } from '@/domain/entities/Asset';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';
import CopyButton from '@/components/shared/common/CopyButton';
import { AssetTypeChip } from './AssetTypeChip';
import { DocumentationIconButton } from '@/components/shared/fieldAttributes/DocumentationIconButton';

interface AssetCardProps {
  asset: Asset | null | undefined;
  isLoading: boolean;
}

export function AssetCard({
  asset,
  isLoading,
}: AssetCardProps): React.ReactElement {
  if (isLoading || !asset) {
    return (
      <Box>
        <Typography variant="h4">Asset Details</Typography>
        <Box mt={2}>
          <Skeleton variant="circular" width={42} height={42} />
          <Skeleton width="60%" />
          <Skeleton width="40%" />
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h4">Asset Details</Typography>
          <DocumentationIconButton polymeshEntity="asset" />
        </Box>
        <Stack direction="row" spacing={1}>
          <AssetTypeChip asset={asset} />
        </Stack>
      </Box>

      <Box display="flex" alignItems="center" mt={2}>
        <Identicon
          value={asset.assetId}
          size={42}
          style={{ marginRight: '16px' }}
        />
        <Box display="flex" flexDirection="column">
          <Typography variant="body1" color="textSecondary">
            Asset ID:
          </Typography>
          <Box display="flex" gap={1}>
            <Typography variant="body1">{asset.assetId}</Typography>
            <CopyButton text={asset.assetId || ''} />
          </Box>
        </Box>
      </Box>

      <Stack spacing={3} mt={4}>
        <Stack direction="row" spacing={2}>
          <Box flex={1}>
            <Typography variant="body2" color="textSecondary" mb={1}>
              Name
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {asset.name}
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="body2" color="textSecondary" mb={1}>
              Ticker
            </Typography>
            <Box display="flex" gap={1} alignItems="center">
              <Typography variant="body1" fontWeight="medium">
                {asset.ticker}
              </Typography>
              <CopyButton text={asset.ticker || ''} />
            </Box>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Box flex={1}>
            <Typography variant="body2" color="textSecondary" mb={1}>
              Owner
            </Typography>
            <AccountOrDidTextField
              value={asset.ownerDid}
              showIdenticon
              isIdentity
            />
          </Box>
          <Box flex={1}>
            <Typography variant="body2" color="textSecondary" mb={1}>
              Type
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {asset.type}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Box width="25%">
            <Typography variant="body2" color="textSecondary">
              Total Supply
            </Typography>
            <Typography variant="h4">{asset.totalSupply}</Typography>
          </Box>
          <Box width="25%">
            <Typography variant="body2" color="textSecondary">
              Holders
            </Typography>
            <Typography variant="h4">{asset.totalHolders}</Typography>
          </Box>
          <Box width="25%">
            <Typography variant="body2" color="textSecondary">
              Documents
            </Typography>
            <Typography variant="h4">{asset.totalDocuments}</Typography>
          </Box>
          <Box width="25%">
            <Typography variant="body2" color="textSecondary">
              Created
            </Typography>
            <Typography variant="body1">
              {asset.createdAt.toLocaleDateString()}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </>
  );
}
