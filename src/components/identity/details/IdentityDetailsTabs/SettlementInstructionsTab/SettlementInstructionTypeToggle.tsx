import React from 'react';
import {
  ToggleButton,
  ToggleButtonGroup,
  styled,
  Tooltip,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import UpdateIcon from '@mui/icons-material/Update';
import { SettlementInstructionToggleOption } from '@/domain/ui/SettlementInstructionToggleOptoin';

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

interface SettlementInstructionOption {
  value: SettlementInstructionToggleOption;
  label: string;
  icon: React.ReactNode;
  tooltip: string;
}

interface SettlementInstructionTypeToggleProps {
  value: SettlementInstructionToggleOption;
  onChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: SettlementInstructionToggleOption | null,
  ) => void;
}

const instructionTypeOptions: SettlementInstructionOption[] = [
  {
    value: 'Current',
    label: 'Current',
    icon: <UpdateIcon sx={{ mr: 0.5 }} />,
    tooltip: 'Settlement Instructions pending to be executed',
  },
  {
    value: 'Historical',
    label: 'Historical',
    icon: <HistoryIcon sx={{ mr: 0.5 }} />,
    tooltip:
      'Settlement Instructions that have already been executed/rejected and were purged from chain',
  },
];

export function SettlementInstructionTypeToggle({
  value,
  onChange,
}: SettlementInstructionTypeToggleProps) {
  return (
    <StyledToggleButtonGroup
      value={value}
      exclusive
      onChange={onChange}
      aria-label="settlement instruction type"
      size="small"
    >
      {instructionTypeOptions.map((option) => (
        <Tooltip
          key={option.value}
          title={option.tooltip}
          arrow
          placement="top"
        >
          <StyledToggleButton
            value={option.value}
            aria-label={option.label.toLowerCase()}
          >
            {option.icon}
            {option.label}
          </StyledToggleButton>
        </Tooltip>
      ))}
    </StyledToggleButtonGroup>
  );
}
