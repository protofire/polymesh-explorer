import React, { useEffect, useState } from 'react';
import { Typography, List } from '@mui/material';
import { Account, Permissions } from '@polymeshassociation/polymesh-sdk/types';
import { customReportError } from '@/utils/customReportError';
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';

interface PermissionsTabProps {
  account: Account;
}

export function PermissionsTab({ account }: PermissionsTabProps) {
  const [permissions, setPermissions] = useState<Permissions>();

  useEffect(() => {
    async function fetchPermissions() {
      try {
        const accountPermissions = await account.getPermissions();
        setPermissions(accountPermissions);
      } catch (error) {
        customReportError(error);
      }
    }

    fetchPermissions();
  }, [account]);

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Permisos de la cuenta
      </Typography>
      {permissions ? (
        <List>
          {/* {permissions.map((permission, index) => (
            <ListItem key={index}>
              <ListItemText primary={permission} />
            </ListItem>
          ))} */}
        </List>
      ) : (
        <NoDataAvailableTBody colSpan={1} />
      )}
    </div>
  );
}
