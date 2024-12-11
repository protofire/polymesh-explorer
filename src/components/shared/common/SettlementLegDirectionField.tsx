import React from 'react';
import { styled } from '@mui/material';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

export enum EInstructionDirection {
  INCOMING = 'Receiving',
  OUTGOING = 'Sending',
  INTER_PORTFOLIO = 'Inter-Portfolio',
  NONE = 'None',
  OFF_CHAIN = 'Off Chain',
}

export interface SettlementLegDirectionFieldProps {
  direction: EInstructionDirection;
}

const StyledWrapper = styled('div')<SettlementLegDirectionFieldProps>(
  ({ theme, direction }) => ({
    display: 'flex',
    alignItems: 'center',
    color: (() => {
      switch (direction) {
        case EInstructionDirection.OUTGOING:
          return theme.palette.error.main;
        case EInstructionDirection.INCOMING:
          return theme.palette.success.main;
        case EInstructionDirection.INTER_PORTFOLIO:
          return theme.palette.info.main;
        case EInstructionDirection.OFF_CHAIN:
          return theme.palette.warning.main;
        default:
          return theme.palette.text.primary;
      }
    })(),
  }),
);

const StyledText = styled('span')({
  marginLeft: '8px',
});

const StyledIcon = styled(ArrowOutwardIcon)<SettlementLegDirectionFieldProps>(
  ({ direction }) => ({
    transform: (() => {
      switch (direction) {
        case EInstructionDirection.INCOMING:
          return 'rotate(90deg)';
        case EInstructionDirection.OUTGOING:
          return 'none';
        case EInstructionDirection.INTER_PORTFOLIO:
          return 'rotate(45deg)';
        case EInstructionDirection.OFF_CHAIN:
          return 'rotate(-45deg)';
        case EInstructionDirection.NONE:
        default:
          return 'none';
      }
    })(),
    visibility: direction === EInstructionDirection.NONE ? 'hidden' : 'visible',
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
