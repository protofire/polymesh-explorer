'use client';

import {
  AppBar,
  Box,
  Container,
  styled,
  Toolbar,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import PolymeshLogo from 'public/polymesh-logo.svg';
import PolymeshBG from 'public/background.png';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { NetworkSelector } from './NetworkSelector';
import { LayoutSearchTextInput } from './LayoutSearchTextInput';

import { ROUTES } from '@/config/routes';

const MainContainer = styled(Container)(() => ({
  color: '#fff',
}));

const CustomAppBar = styled(AppBar)({
  backgroundColor: 'transparent',
  boxShadow: 'none',
  padding: '1rem 0',
  height: '7.5rem',
});

const StyledLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit',
});

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
      <CustomAppBar elevation={0} position="static">
        <Toolbar>
          <StyledLink href={ROUTES.Home}>
            <Box display="flex" alignItems="center">
              <Image src={PolymeshLogo} height={22} alt="Polymesh logo" />
              <Typography variant="h6" ml={2}>
                EXPLORER
              </Typography>
            </Box>
          </StyledLink>
          {isHomePage ? null : <LayoutSearchTextInput />}
          {buttonActionComponent}
        </Toolbar>
      </CustomAppBar>
      <MainContainer maxWidth="lg">{children}</MainContainer>
    </Box>
  );
}
