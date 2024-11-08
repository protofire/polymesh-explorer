import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Skeleton,
  Tooltip,
  IconButton,
  SvgIcon,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockIcon from '@mui/icons-material/Block';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { BigNumber } from '@polymeshassociation/polymesh-sdk';
import { Asset } from '@/domain/entities/Asset';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';
import CopyButton from '@/components/shared/common/CopyButton';
import { AssetTypeChip } from './AssetTypeChip';
import { DocumentationIconButton } from '@/components/shared/fieldAttributes/DocumentationIconButton';
import { FormattedDate } from '@/components/shared/common/FormattedDateText';

interface AssetCardProps {
  asset: Asset | null | undefined;
  isLoading: boolean;
}

export function AssetCard({
  asset,
  isLoading,
}: AssetCardProps): React.ReactElement {
  const [showUuid, setShowUuid] = useState(true);

  if (isLoading || !asset) {
    return (
      <Box>
        <Typography variant="h4">Asset Details</Typography>
        <Box mt={2}>
          <Skeleton width="60%" />
          <Skeleton width="40%" />
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
        <Box display="flex" flexDirection="column">
          <Typography variant="body1" color="textSecondary">
            {showUuid ? 'Asset Id:' : 'Asset Id (0x hex format):'}
          </Typography>
          <Box display="flex" gap={1} alignItems="center">
            <Typography variant="body1">
              {showUuid ? asset.assetUuid : asset.assetId}
            </Typography>
            <CopyButton
              text={showUuid ? asset.assetUuid || '' : asset.assetId || ''}
            />
            <Tooltip
              title={`${showUuid ? 'Asset Id in 0x + 32 hex format' : 'Asset Id in UUID 8-4-4-4-12 format'}`}
            >
              <IconButton size="small" onClick={() => setShowUuid(!showUuid)}>
                <SvgIcon
                  component={SwapHorizIcon}
                  inheritViewBox
                  sx={{ fontSize: '1.1rem', color: '#bdbdbd' }}
                />
              </IconButton>
            </Tooltip>
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
            <Stack direction="row" spacing={2}>
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
              <Box flex={1}>
                <Typography variant="body2" color="textSecondary" mb={1}>
                  Created
                </Typography>
                <FormattedDate date={asset.createdAt} variant="body1" />
              </Box>
            </Stack>
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
            <Stack direction="row" spacing={2}>
              <Box flex={1}>
                <Typography variant="body2" color="textSecondary" mb={1}>
                  Type
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {asset.type}
                </Typography>
              </Box>
              <Box flex={1}>
                <Typography variant="body2" color="textSecondary" mb={1}>
                  Divisibility
                </Typography>
                <Box display="flex" alignItems="center">
                  <Tooltip
                    title={asset.isDivisible ? 'Divisible' : 'Non-divisible'}
                  >
                    {asset.isDivisible ? (
                      <CheckCircleOutlineIcon color="success" />
                    ) : (
                      <BlockIcon color="error" />
                    )}
                  </Tooltip>
                </Box>
              </Box>
            </Stack>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2} pb={2}>
          <Box flex={1}>
            <Typography variant="body2" color="textSecondary">
              Total Supply
            </Typography>
            <Typography variant="h4">
              {new BigNumber(asset.totalSupply).toFormat()}
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="body2" color="textSecondary">
              Holders
            </Typography>
            <Typography variant="h4">{asset.totalHolders}</Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="body2" color="textSecondary">
              Documents
            </Typography>
            <Typography variant="h4">{asset.totalDocuments}</Typography>
          </Box>
        </Stack>
      </Stack>
    </>
  );
}
