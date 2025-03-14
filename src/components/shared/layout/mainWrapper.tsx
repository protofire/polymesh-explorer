import React from 'react';
import { Card } from '@mui/material';
import { MAIN_BACKGROUND } from '@/theme/colors';

interface MainWrapperProps {
  children: React.ReactNode;
}

export function MainWrapper({
  children,
}: MainWrapperProps): React.ReactElement {
  return (
    <Card
      variant="outlined"
      sx={{
        background: `${MAIN_BACKGROUND}d1`,
        marginTop: '2rem',
        padding: '2rem',
        borderRadius: '1rem',
        border: '1px solid #240A2E',
      }}
    >
      {children}
    </Card>
  );
}
