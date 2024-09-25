import { Providers } from '@/context/Providers';
import { AppLayout } from '@/components/shared/layout/AppLayout';
import TopLoader from '@/components/shared/TopLoader';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TopLoader />
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
