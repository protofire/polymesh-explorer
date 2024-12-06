import React, { useMemo } from 'react';
import { Box, Typography, Tooltip, TooltipProps } from '@mui/material';
import Identicon from '@polkadot/ui-identicon';
import { truncateAddress } from '@/services/polymesh/address';
import { GenericLink } from '../common/GenericLink';
import CopyButton from '../common/CopyButton';
import { ROUTES } from '@/config/routes';

interface AccountOrDidTextFieldProps extends React.PropsWithChildren {
  value: string;
  showIdenticon?: boolean;
  isIdentity?: boolean;
  sideLength?: number;
  variant?: 'body1' | 'body2';
  hideCopyButton?: boolean;
  tooltipText?: string;
  tooltipPlacement?: TooltipProps['placement'];
}

export function AccountOrDidTextField({
  value,
  showIdenticon = false,
  isIdentity = false,
  sideLength = 5,
  variant = 'body1',
  hideCopyButton = false,
  tooltipText,
  tooltipPlacement,
  children,
}: AccountOrDidTextFieldProps): React.ReactElement {
  const identiconTheme = isIdentity ? 'jdenticon' : 'polkadot';
  const pathUrl = isIdentity ? ROUTES.Identity : ROUTES.Account;
  const textToDisplay = useMemo(() => {
    if (children && typeof children === 'string') {
      return children;
    }

    return value;
  }, [children, value]);

  const defaultTooltipText = isIdentity ? 'Open Identity' : 'Open Account';
  const finalTooltipText = tooltipText || defaultTooltipText;

  return (
    <Box display="flex" gap={1} alignItems="center">
      {showIdenticon && (
        <Identicon
          value={value}
          size={24}
          theme={identiconTheme}
          style={{ marginRight: '5px' }}
        />
      )}
      <Tooltip title={finalTooltipText} placement={tooltipPlacement}>
        <Typography variant={variant}>
          <GenericLink href={`${pathUrl}/${value}`}>
            {truncateAddress(textToDisplay, sideLength)}
          </GenericLink>
        </Typography>
      </Tooltip>
      {!hideCopyButton && <CopyButton text={value} />}
    </Box>
  );
}
