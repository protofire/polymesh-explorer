import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import { Providers } from '@/components/Providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6">Polymesh Explorer</Typography>
            </Toolbar>
          </AppBar>
          <Container>{children}</Container>
        </Providers>
      </body>
    </html>
  );
}
