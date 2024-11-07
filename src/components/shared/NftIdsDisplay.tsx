import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import CopyButton from './common/CopyButton';
import { CounterBadge } from './common/CounterBadge';

interface NftIdsDisplayProps {
  nftIds: string[];
  maxIdsToShow?: number;
}

function NftIdsDisplay({ nftIds, maxIdsToShow = 3 }: NftIdsDisplayProps) {
  const displayIds = nftIds.slice(0, maxIdsToShow);
  const hasMore = nftIds.length > maxIdsToShow;
  const allIds = nftIds.join(', ');

  return (
    <Box display="flex" alignItems="center">
      <Tooltip title={allIds}>
        <Typography
          variant="body2"
          sx={{
            maxWidth: '150px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {displayIds.join(', ')}
          {hasMore ? '...' : ''}
        </Typography>
      </Tooltip>
      <CopyButton
        text={allIds}
        initialToolTipText={
          hasMore ? (
            <CounterBadge count={nftIds.length}>Copy all nft Ids</CounterBadge>
          ) : (
            'Copy'
          )
        }
      />
    </Box>
  );
}

export default NftIdsDisplay;
