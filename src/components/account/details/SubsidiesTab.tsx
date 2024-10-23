import React from 'react';
import { Typography } from '@mui/material';
import { Account } from '@polymeshassociation/polymesh-sdk/types';

interface SubsidiesTabProps {
  account: Account;
}

export function SubsidiesTab({ account }: SubsidiesTabProps) {
  return (
    <Typography>
      Subsidies information for account {account.address} will be displayed
      here.
    </Typography>
  );
}
