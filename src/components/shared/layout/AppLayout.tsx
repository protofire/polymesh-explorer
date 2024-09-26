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

const MainContainer = styled(Container)(() => ({
  color: '#fff',
}));

const CustomAppBar = styled(AppBar)({
  backgroundColor: 'transparent',
  boxShadow: 'none',
  padding: '1rem 0',
});

export function AppLayout({ children }: React.PropsWithChildren) {
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
          <Image src={PolymeshLogo} height={22} alt="Polymesh logo" />
          <Typography variant="h6" ml={2}>
            EXPLORER
          </Typography>
        </Toolbar>
      </CustomAppBar>
      <MainContainer maxWidth="lg">{children}</MainContainer>
    </Box>
  );
}
