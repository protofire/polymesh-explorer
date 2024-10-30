import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Chip,
  Tooltip,
  IconButton,
} from '@mui/material';
import { LockOutlined, OpenInNew } from '@mui/icons-material';
import { AssetDetails } from '@/domain/entities/Asset';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';
import CopyButton from '@/components/shared/common/CopyButton';

interface OverviewTabProps {
  assetDetails: AssetDetails | null;
  isLoading: boolean;
  error: Error | null;
}

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
  description?: string;
  copyValue?: string;
  isUrl?: boolean;
  isLocked?: boolean;
  lockedUntil?: Date;
}

function InfoItem({
  label,
  value,
  description,
  copyValue,
  isUrl,
  isLocked,
  lockedUntil,
}: InfoItemProps) {
  return (
    <Box mb={2}>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="body2" color="textSecondary" component="span">
          {label}
        </Typography>
        {description && (
          <Tooltip title={description}>
            <IconButton size="small">
              <LockOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {isLocked && (
          <Tooltip
            title={
              lockedUntil
                ? `Locked until ${lockedUntil.toLocaleDateString()}`
                : 'Locked permanently'
            }
          >
            <LockOutlined fontSize="small" color="warning" />
          </Tooltip>
        )}
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        {isUrl ? (
          <>
            <Typography
              component="a"
              href={value?.toString()}
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              sx={{ textDecoration: 'none' }}
            >
              {value}
            </Typography>
            <OpenInNew fontSize="small" />
          </>
        ) : (
          <Typography component="span">{value || '-'}</Typography>
        )}
        {copyValue && <CopyButton text={copyValue} />}
      </Box>
    </Box>
  );
}

export function GeneralInfoTab({
  assetDetails,
  isLoading,
  error,
}: OverviewTabProps): React.ReactElement {
  if (isLoading) {
    return <GenericTableSkeleton columnCount={2} rowCount={6} />;
  }

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  if (!assetDetails?.details) {
    return <Typography>No details available</Typography>;
  }

  const {
    details: {
      assetIdentifiers,
      collectionId,
      fundingRound,
      metaData,
      requiredMediators,
      venueFilteringEnabled,
      permittedVenuesIds,
      isFrozen,
    },
  } = assetDetails;

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" flexDirection="column" gap={3}>
        {/* Funding Round */}
        {fundingRound && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <InfoItem label="Funding Round" value={fundingRound} />
          </Box>
        )}

        {/* Collection Info (if NFT) */}
        {collectionId && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Collection Information
            </Typography>
            <InfoItem
              label="Collection ID"
              value={collectionId}
              copyValue={collectionId.toString()}
            />
          </Box>
        )}

        {/* Asset Identifiers */}
        {assetIdentifiers.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Asset Identifiers
            </Typography>
            {assetIdentifiers.map((identifier) => (
              <InfoItem
                key={identifier.type}
                label={identifier.type.toUpperCase()}
                value={identifier.value}
              />
            ))}
          </Box>
        )}

        {/* Metadata */}
        {metaData.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Metadata
            </Typography>
            {metaData.map((meta) => (
              <InfoItem
                key={meta.name}
                label={meta.name}
                value={meta.value}
                description={meta.description}
                isLocked={!!meta.isLocked}
                lockedUntil={meta.lockedUntil}
                isUrl={meta.value?.toString().startsWith('http')}
              />
            ))}
          </Box>
        )}

        {/* Transfer Restrictions */}
        <Box>
          <Typography variant="h6" gutterBottom component="span">
            Transfer Restrictions
          </Typography>
          <InfoItem
            label="Transfers Frozen"
            value={
              <Chip
                label={isFrozen ? 'Yes' : 'No'}
                color={isFrozen ? 'error' : 'success'}
                size="small"
              />
            }
          />
          <InfoItem
            label="Venue Filtering"
            value={
              <Chip
                label={venueFilteringEnabled ? 'Enabled' : 'Disabled'}
                color={venueFilteringEnabled ? 'primary' : 'default'}
                size="small"
              />
            }
            description="When enabled only the permitted venues can create instructions containing this asset"
          />
          {venueFilteringEnabled && permittedVenuesIds.length > 0 && (
            <InfoItem
              label="Permitted Venues"
              value={permittedVenuesIds.join(', ')}
              description="IDs for venues allowed to create transfer instructions"
            />
          )}
        </Box>

        {/* Required Mediators */}
        {requiredMediators.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom component="span">
              Required Mediators
            </Typography>
            {requiredMediators.map((mediator) => (
              <Box key={mediator} mb={1}>
                <AccountOrDidTextField
                  value={mediator}
                  showIdenticon
                  isIdentity
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
}
