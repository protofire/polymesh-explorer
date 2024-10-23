import React from 'react';
import { Typography, Link } from '@mui/material';
import { Account } from '@polymeshassociation/polymesh-sdk/types';

interface ExternalLinksTabProps {
  account: Account;
  subscanUrl: string;
}

export function ExternalLinksTab({
  account,
  subscanUrl,
}: ExternalLinksTabProps) {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        External Links
      </Typography>
      <Link
        href={`${subscanUrl}/account/${account.address}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View on Subscan
      </Link>
    </>
  );
}
