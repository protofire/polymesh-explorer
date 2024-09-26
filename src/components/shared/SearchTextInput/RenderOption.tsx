import Link from 'next/link';
import React from 'react';
import { Box, Typography } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { SearchTextInputOption } from '@/domain/ui/SearchTextInputOption';

interface Props {
  option: SearchTextInputOption;
  props: React.HTMLAttributes<HTMLLIElement> & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key: any;
  };
}

export function RenderOptionItem({ props, option }: Props) {
  if (option.type === 'Unknown') {
    return null;
  }

  return (
    <Link href={option.link} passHref legacyBehavior>
      <Box
        component="a"
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        sx={{ textDecoration: 'none', color: 'inherit' }}
      >
        <AccountBalanceWalletIcon sx={{ color: '#ff5f5f', mr: 2 }} />
        <Typography variant="body2">
          {(option as SearchTextInputOption).value}
        </Typography>
      </Box>
    </Link>
  );
}
