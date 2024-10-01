'use client';

import { Box, Container, styled } from '@mui/material';

import PolymeshBG from 'public/background.png';
import React, { useMemo } from 'react';
import { AppProvider } from '@toolpad/core/nextjs';
import { usePathname } from 'next/navigation';
import { DashboardLayout } from '@/components/shared/layout/DashboardLayout';
import { NetworkSelector } from './NetworkSelector';
import { Providers } from '@/context/Providers';
import TopLoader from '@/components/shared/TopLoader';
import { LayoutSearchTextInput } from './LayoutSearchTextInput';

// import { ROUTES } from '@/config/routes';

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
      <AppProvider>
        <TopLoader />
        <Providers>
          <DashboardLayout
            slots={{
              toolbarActions: () => barActions,
            }}
          >
            <MainContainer maxWidth="lg">{children}</MainContainer>
          </DashboardLayout>
        </Providers>
      </AppProvider>
    </Box>
  );
}
