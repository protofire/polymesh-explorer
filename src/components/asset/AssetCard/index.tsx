import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Skeleton,
} from '@mui/material';
import Link from 'next/link';
import { Asset } from '@/domain/entities/Asset';
import { truncateAddress } from '@/services/polymesh/address';
import { ROUTES } from '@/config/routes';

interface AssetCardProps {
  asset: Asset | null | undefined;
  isLoading: boolean;
}

export function AssetCard({
  asset,
  isLoading,
}: AssetCardProps): React.ReactElement {
  const renderValue = (value: string | number | undefined) =>
    value === undefined || isLoading ? <Skeleton width={100} /> : value;

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h4">Asset Details</Typography>
        </Box>
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Ticker:
            </Typography>
            <Typography variant="body1">
              {renderValue(asset?.ticker)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Name:
            </Typography>
            <Typography variant="body1">{renderValue(asset?.name)}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Type:
            </Typography>
            <Typography variant="body1">{renderValue(asset?.type)}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Total Supply:
            </Typography>
            <Typography variant="body1">
              {renderValue(asset?.totalSupply)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Owner (DID):
            </Typography>
            <Typography variant="body1">
              <Link href={`${ROUTES.Identity}/${asset?.ownerDid}`}>
                {truncateAddress(asset?.ownerDid)}
              </Link>
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Documents:
            </Typography>
            <Typography variant="body1">
              {renderValue(asset?.documents)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Asset Holders:
            </Typography>
            <Typography variant="body1">
              {renderValue(asset?.holders)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Creation Date:
            </Typography>
            <Typography variant="body1">
              {asset?.createdAt.toISOString()}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
