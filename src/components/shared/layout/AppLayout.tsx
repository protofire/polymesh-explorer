'use client';

import { Box, Container, styled } from '@mui/material';

import PolymeshBG from 'public/background.png';
import React, { useMemo } from 'react';
import { AppProvider } from '@toolpad/core/nextjs';
import { usePathname } from 'next/navigation';
import { DashboardLayout } from '@/components/shared/layout/DashboardLayout';
import { NetworkSelector } from './NetworkSelector';
import { LayoutSearchTextInput } from './LayoutSearchTextInput';

const MainContainer = styled(Container)(() => ({
  color: '#fff',
}));

interface Props {
  children: React.ReactNode;
  buttonActionComponent?: React.ReactNode;
}

export function AppLayout({
  children,
  buttonActionComponent = <NetworkSelector />,
}: Props) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const barActions = useMemo(() => {
    return (
      <>
        {isHomePage ? null : <LayoutSearchTextInput />}
        {buttonActionComponent}
      </>
    );
  }, [buttonActionComponent, isHomePage]);

  return (
    <Box
      sx={{
        backgroundImage: `url(${PolymeshBG.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <DashboardLayout
        slots={{
          toolbarActions: () => barActions,
        }}
      >
        <MainContainer maxWidth="lg">{children}</MainContainer>
      </DashboardLayout>
    </Box>
  );
}
