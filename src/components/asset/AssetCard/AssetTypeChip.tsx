import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import TokenIcon from '@mui/icons-material/Toll';
import CollectionsIcon from '@mui/icons-material/Collections';
import { Asset } from '@/domain/entities/Asset';

export function AssetTypeChip({ asset }: { asset: Asset }) {
  if (asset.isNftCollection) {
    return (
      <Tooltip title="This is an NFT Collection">
        <Chip
          icon={<CollectionsIcon />}
          label="Non-Fungible"
          color="primary"
          variant="outlined"
        />
      </Tooltip>
    );
  }
  return (
    <Tooltip title="This is a Fungible Token">
      <Chip
        icon={<TokenIcon />}
        label="Fungible"
        color="secondary"
        variant="outlined"
      />
    </Tooltip>
  );
}
