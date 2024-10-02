/* eslint-disable react/jsx-props-no-spreading */
import Link from 'next/link';
import React from 'react';
import { Box, Typography } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { SearchTextInputOption } from '@/domain/ui/SearchTextInputOption';

interface Props {
  option: SearchTextInputOption;
  props: React.HTMLAttributes<HTMLLIElement> & {
    key: React.Key;
  };
  selected: boolean;
}

export function RenderOptionItem({ props, option, selected }: Props) {
  if (option.type === 'Unknown') {
    return (
      <Box>
        <Typography>No results found with this search</Typography>
      </Box>
    );
  }

  const { key, ...rest } = props;

  return (
    <Link href={option.link} passHref legacyBehavior>
      <Box
        component="a"
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        sx={{
          textDecoration: 'none',
          color: 'inherit',
          backgroundColor: selected ? '#4a4a4a' : 'transparent',
          '&:hover': {
            backgroundColor: '#3a3a3a',
          },
          display: 'flex',
          alignItems: 'center',
          padding: '8px 16px',
          borderRadius: '4px',
          transition: 'background-color 0.2s',
        }}
      >
        <AccountBalanceWalletIcon sx={{ color: '#ff5f5f', mr: 2 }} />
        <Typography
          variant="body2"
          sx={{
            fontWeight: selected ? 'bold' : 'normal',
          }}
        >
          {(option as SearchTextInputOption).value}
        </Typography>
      </Box>
    </Link>
  );
}
