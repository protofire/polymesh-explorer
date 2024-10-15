import { Suspense } from 'react';
import { Providers } from '@/context/Providers';
import { AppLayout } from '@/components/shared/layout/AppLayout';
import TopLoader from '@/components/shared/TopLoader';

export const metadata = {
  title: 'Polymesh Blockchain Explorer',
  description:
    'A tool to navigate and explore the Polymesh blockchain with ease. Dive into blocks, transactions, accounts, and more in a user-friendly interface.',
  icons: {
    icon: '/ico/favicon.ico',
  },
};

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
          <Suspense fallback={<>Loading...</>}>
            <AppLayout>{children}</AppLayout>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
