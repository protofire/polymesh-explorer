import React, { useEffect, useState } from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';
import { Account, Permission } from '@polymeshassociation/polymesh-sdk/types';

interface PermissionsTabProps {
  account: Account;
}

export function PermissionsTab({ account }: PermissionsTabProps) {
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    async function fetchPermissions() {
      try {
        const accountPermissions = await account.getPermissions();
        setPermissions(accountPermissions);
      } catch (error) {
        console.error('Error al obtener los permisos:', error);
      }
    }

    fetchPermissions();
  }, [account]);

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Permisos de la cuenta
      </Typography>
      {permissions.length > 0 ? (
        <List>
          {permissions.map((permission, index) => (
            <ListItem key={index}>
              <ListItemText primary={permission} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>Esta cuenta no tiene permisos asignados.</Typography>
      )}
    </div>
  );
}
