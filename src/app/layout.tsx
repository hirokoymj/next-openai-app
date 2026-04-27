'use client';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SideNav from '@/components/SideNav';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();
export const runtime = 'nodejs';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="m-0 font-sans" suppressHydrationWarning={true}>
        <QueryClientProvider client={queryClient}>
          <Header />

          <div className="flex min-h-[90vh]">
            <SideNav />
            <main className="flex-1 p-4">{children}</main>
          </div>

          <Footer />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
