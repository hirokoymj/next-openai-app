'use client';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeftNav from '@/components/LeftNav';
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
            <nav className="w-50 bg-gray-100 p-4">
              <ul className="list-none p-0">
                {/* Gemini section */}
                <li className="mb-2 text-xs font-semibold text-gray-500 uppercase">
                  Gemini
                </li>
                <LeftNav
                  href="/file-chat"
                  title="AI File Chat"
                  provider="gemini"
                />
                <LeftNav href="/ai/recipe" title="Recipe" provider="gemini" />
                <LeftNav
                  href="/filesearch"
                  title="File Search (RAG)"
                  provider="gemini"
                />

                <hr className="my-3 border-gray-300" />
                {/* OpenAI section */}
                <li className="mb-2 text-xs font-semibold text-gray-500 uppercase">
                  OpenAI
                </li>
                <LeftNav href="/recipe" title="AI Recipe" provider="openai" />
                <LeftNav href="/summary" title="AI Summary" provider="openai" />
                <LeftNav
                  href="/image_generator"
                  title="AI Image Generator"
                  provider="openai"
                />
                <hr className="my-3 border-gray-300" />
                <LeftNav href="/users" title="Users" />
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
