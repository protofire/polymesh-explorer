'use client';

import { AppBar, Container, styled, Toolbar, Typography } from '@mui/material';

const MainContainer = styled(Container)(() => ({
  minHeight: '100vh',
  background: 'linear-gradient(to right, #0d0d0d, #1a1a1a)',
  color: '#fff',
}));

const CustomAppBar = styled(AppBar)({
  backgroundColor: '#1a1a1a',
  boxShadow: 'none',
  padding: '1rem 0',
});

export function AppLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <CustomAppBar position="static">
        <Toolbar>
          <Typography variant="h6">Polymesh Explorer</Typography>
        </Toolbar>
      </CustomAppBar>
      <MainContainer maxWidth="lg">{children}</MainContainer>
    </>
  );
}
