'use client';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import LeftNav from './components/LeftNav';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="m-0 font-sans">
        <QueryClientProvider client={queryClient}>
          <Header />

          <div className="flex min-h-[90vh]">
            <nav className="w-48 bg-gray-100 p-4">
              <ul className="list-none p-0">
                <LeftNav href="/users" title="Users" />
                <LeftNav href="/chat" title="AI Chat" />
                <LeftNav href="/recipe" title="AI Recipe" />
                <LeftNav href="/summary" title="AI Summary" />
              </ul>
            </nav>

            <main className="flex-1 p-4">{children}</main>
          </div>

          <Footer />

          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
