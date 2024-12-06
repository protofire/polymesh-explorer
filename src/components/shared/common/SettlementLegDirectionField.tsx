import React from 'react';
import { styled } from '@mui/material';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

export interface SettlementLegDirectionFieldProps {
  direction: 'Sending' | 'Receiving';
}

const StyledWrapper = styled('div')<SettlementLegDirectionFieldProps>(
  ({ theme, direction }) => ({
    display: 'flex',
    alignItems: 'center',
    color:
      direction === 'Sending'
        ? theme.palette.error.main
        : theme.palette.success.main,
  }),
);

const StyledText = styled('span')({
  marginLeft: '8px',
});

const StyledIcon = styled(ArrowOutwardIcon)<SettlementLegDirectionFieldProps>(
  ({ direction }) => ({
    transform: direction === 'Receiving' ? 'rotate(90deg)' : 'none',
  }),
);

export function SettlementLegDirectionField({
  direction,
}: SettlementLegDirectionFieldProps) {
  return (
    <StyledWrapper direction={direction}>
      <StyledIcon direction={direction} />
      <StyledText>{direction}</StyledText>
    </StyledWrapper>
  );
}
