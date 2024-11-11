import React, { useState } from 'react';
import { Box, Typography, IconButton, Collapse } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Count } from '@polymeshassociation/polymesh-sdk/api/entities/Asset/Fungible/TransferRestrictions/Count';
import { GenericLink } from './common/GenericLink';
import { ROUTES } from '@/config/routes';
import { CounterBadge } from './common/CounterBadge';

interface NftIdsDisplayProps {
  nftIds: string[];
  assetId: string;
  maxIdsToShow?: number;
}

function WithCounterBadge({
  enable,
  length,
  children,
}: {
  enable: boolean;
  length: number;
  children: React.ReactNode;
}) {
  if (!enable) return children;

  return <CounterBadge count={length}>{children}</CounterBadge>;
}

function NftIdsDisplay({
  nftIds,
  assetId,
  maxIdsToShow = 3,
}: NftIdsDisplayProps) {
  const [expanded, setExpanded] = useState(false);
  const displayIds = expanded ? nftIds : nftIds.slice(0, maxIdsToShow);
  const hasMore = nftIds.length > maxIdsToShow;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const renderNftLink = (nftId: string, index: number) => (
    <React.Fragment key={nftId}>
      <GenericLink
        href={`${ROUTES.Asset}/${assetId}${ROUTES.NftView}/${nftId}`}
      >
        {nftId}
      </GenericLink>
      {index < displayIds.length - 1 && ', '}
    </React.Fragment>
  );

  return (
    <Box display="flex" alignItems="center">
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2">
          {displayIds.map((id, index) => renderNftLink(id, index))}
        </Typography>
      </Box>
      {hasMore && (
        <WithCounterBadge length={nftIds.length} enable={!expanded}>
          <IconButton
            size="small"
            onClick={handleExpandClick}
            sx={{
              ml: 0.5,
              padding: '2px',
            }}
            aria-label={expanded ? 'show less' : 'show more'}
          >
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </WithCounterBadge>
      )}
    </Box>
  );
}

export default NftIdsDisplay;
