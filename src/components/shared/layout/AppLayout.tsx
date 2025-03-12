'use client';

import { Box, Container, styled, Typography } from '@mui/material';

import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { NorthEast } from '@mui/icons-material';

import { DashboardLayout } from '@/components/shared/layout/DashboardLayout';
import { NetworkSelector } from './NetworkSelector';
import { LayoutSearchTextInput } from './LayoutSearchTextInput';
import { APP_BACKGROUD, PROTOFIRE_LOGO } from '@/config/images';
import { GenericLink } from '../common/GenericLink';
import { POLYMESH_DOCS } from '@/config/constant';
import { useVersion } from '@/hooks/common/useVersion';
import { ContactModal } from './ContactModal';

const MainContainer = styled(Container)(() => ({
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: '100%',
}));

const ContentWrapper = styled(Box)(() => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
}));

const Footer = styled(Box)(() => ({
  color: '#fff',
  padding: '20px 0',
  textAlign: 'center',
  width: '100%',
  background:
    'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%)',
  backdropFilter: 'blur(5px)',
  marginTop: 'auto',
  height: '80px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

interface Props {
  children: React.ReactNode;
  buttonActionComponent?: React.ReactNode;
}

export function AppLayout({
  children,
  buttonActionComponent = <NetworkSelector />,
}: Props) {
  const { version, loading } = useVersion();

  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const barActions = useMemo(() => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexGrow: '1',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex' }}>
          {isHomePage ? null : <LayoutSearchTextInput />}
        </Box>
        <Box sx={{ display: 'flex' }}>{buttonActionComponent}</Box>
      </Box>
    );
  }, [buttonActionComponent, isHomePage]);

  return (
    <Box
      sx={{
        backgroundImage: `url(${APP_BACKGROUD.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          height: '100%',
        }}
      >
        <DashboardLayout
          slots={{
            toolbarActions: () => barActions,
          }}
        >
          <MainContainer maxWidth="lg">
            <ContentWrapper>{children}</ContentWrapper>
          </MainContainer>
        </DashboardLayout>
        <Footer
          sx={{
            zIndex: 2,
            px: '24px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="caption">
            <GenericLink isExternal href={POLYMESH_DOCS}>
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                Polymesh Docs
                <NorthEast sx={{ fontSize: 'small' }} />
              </Box>
            </GenericLink>
          </Typography>
          <Typography sx={{ opacity: 0.5 }} variant="caption">
            V {version || (loading ? '0.0.0' : '0.0.0')}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography sx={{ color: '#D6D6D6', fontSize: '12px' }}>
              developed by
            </Typography>

            <Image alt="Protofire" src={PROTOFIRE_LOGO} />

            <ContactModal />
          </Box>
        </Footer>
      </Box>
    </Box>
  );
}
