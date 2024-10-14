import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { IconButton, Link, SxProps, Theme, Tooltip } from '@mui/material';
import React from 'react';

export interface ExplorerConfig {
  baseUrl: string;
  path: string;
}

export interface ExplorerLinkProps {
  explorerConfig: ExplorerConfig;
  txHash?: string;
  sx?: SxProps<Theme>;
  toolTipText?: string;
}

export function ExplorerLink({
  explorerConfig,
  txHash,
  sx,
  toolTipText = 'See in subscan',
}: ExplorerLinkProps) {
  const linkDisabled = !txHash;
  const fullPath = `${explorerConfig.baseUrl}${explorerConfig.path}/${txHash}`;

  const iconWithStyles = (
    <Tooltip
      title={linkDisabled ? 'Transaction hash is not available.' : toolTipText}
      placement="top"
    >
      <ArrowOutwardIcon fontSize="small" />
    </Tooltip>
  );

  if (linkDisabled) return null;

  return (
    <Link href={fullPath} target="_blank">
      <IconButton disabled={linkDisabled} size="small" sx={sx}>
        {iconWithStyles}
      </IconButton>
    </Link>
  );
}
