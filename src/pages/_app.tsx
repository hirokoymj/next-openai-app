import '@/app/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SideNav from '@/components/SideNav';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="m-0 font-sans">
      <Header />

      <div className="flex min-h-[90vh]">
        <SideNav />
        <main className="flex-1 p-4">
          <Component {...pageProps} />
        </main>
      </div>

      <Footer />
    </div>
  );
}
