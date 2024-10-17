import { ToggleButton, ToggleButtonGroup, styled } from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';
import TokenIcon from '@mui/icons-material/Toll';

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

export type AssetTypeSelected = 'Fungible' | 'NonFungible';

interface AssetTypeToggleButtonProps {
  assetType: AssetTypeSelected;
  onChange: (
    event: React.MouseEvent<HTMLElement>,
    newAssetType: AssetTypeSelected,
  ) => void;
}

export function AssetTypeToggleButton({
  assetType,
  onChange,
}: AssetTypeToggleButtonProps) {
  return (
    <StyledToggleButtonGroup
      value={assetType}
      exclusive
      onChange={onChange}
      aria-label="asset type"
      size="small"
    >
      <StyledToggleButton value="Fungible" aria-label="fungible assets">
        <TokenIcon sx={{ mr: 0.5 }} />
        Fungible Assets
      </StyledToggleButton>
      <StyledToggleButton value="NonFungible" aria-label="non-fungible assets">
        <CollectionsIcon sx={{ mr: 0.5 }} />
        Non-Fungible Assets
      </StyledToggleButton>
    </StyledToggleButtonGroup>
  );
}
