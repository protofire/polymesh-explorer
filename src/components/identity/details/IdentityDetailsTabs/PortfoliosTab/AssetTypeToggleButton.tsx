import React from 'react';
import { ToggleButton, ToggleButtonGroup, styled } from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';
import TokenIcon from '@mui/icons-material/Toll';
import { AssetTokenType } from '@/domain/criteria/AssetCriteria';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 24,
  backgroundColor: theme.palette.background.paper,
  height: 32,
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  margin: 2,
  borderRadius: 20,
  padding: '0 8px',
  fontSize: '0.75rem',
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

export type AssetTypeSelected = AssetTokenType;

interface AssetTypeOption {
  value: AssetTypeSelected;
  label: string;
  icon?: React.ReactNode;
}

interface AssetTypeToggleButtonProps {
  assetType: AssetTypeSelected;
  onChange: (
    event: React.MouseEvent<HTMLElement>,
    newAssetType: AssetTypeSelected,
  ) => void;
  includeAllOption?: boolean;
}

export const assetTypeOptions: AssetTypeOption[] = [
  {
    value: 'Fungible',
    label: 'Fungible',
    icon: <TokenIcon sx={{ mr: 0.5 }} />,
  },
  {
    value: 'NonFungible',
    label: 'Non-Fungible',
    icon: <CollectionsIcon sx={{ mr: 0.5 }} />,
  },
];

const allOption: AssetTypeOption = { value: 'All', label: 'All' };

export function AssetTypeToggleButton({
  assetType,
  onChange,
  includeAllOption = false,
}: AssetTypeToggleButtonProps) {
  const options = includeAllOption
    ? [allOption, ...assetTypeOptions]
    : assetTypeOptions;

  return (
    <StyledToggleButtonGroup
      value={assetType}
      exclusive
      onChange={onChange}
      aria-label="asset type"
      size="small"
    >
      {options.map((option) => (
        <StyledToggleButton
          key={option.value}
          value={option.value}
          aria-label={option.label.toLowerCase()}
        >
          {option.icon}
          {option.label}
        </StyledToggleButton>
      ))}
    </StyledToggleButtonGroup>
  );
}
