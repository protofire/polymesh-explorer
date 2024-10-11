import React from 'react';
import { Badge, styled } from '@mui/material';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -10,
    top: 0,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
    height: '20px',
    minWidth: '20px',
    borderRadius: '10px',
  },
}));

interface CounterBadgeProps {
  count: number;
  children: React.ReactNode;
}

export function CounterBadge({ count, children }: CounterBadgeProps) {
  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <StyledBadge badgeContent={displayCount} color="primary">
      {children}
    </StyledBadge>
  );
}
