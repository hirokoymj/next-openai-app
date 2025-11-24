import Link from 'next/link';
import './globals.css';
import LeftNav from './components/LeftNav';
import { AiFillGithub } from 'react-icons/ai';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif' }}>
        <header
          style={{ background: '#1e40af', color: 'white', padding: '1rem' }}>
          <h1>Next.js AI &amp; CRUD Application</h1>
        </header>
        <div style={{ display: 'flex', minHeight: '90vh' }}>
          <nav
            style={{ width: '200px', background: '#f3f4f6', padding: '1rem' }}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <LeftNav href="/users" title="Users" />
              <LeftNav href="/todos" title="Todos" />
              <LeftNav href="/chat" title="AI Chat" />
              <LeftNav href="/recipe" title="AI Recipe" />
            </ul>
          </nav>

          <main style={{ flex: 1, padding: '1rem' }}>{children}</main>
        </div>

        <footer
          style={{
            background: '#1e40af',
            color: 'white',
            padding: '1rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
          }}>
          <span>© 2025 Hiroko Yamaji. Built with Next.js and OpenAI.</span>
          <Link
            href="https://github.com/hirokoymj/next-openai-app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open source on GitHub"
            style={{ color: 'white', display: 'inline-flex' }}>
            <AiFillGithub size={30} />
          </Link>
        </footer>
      </body>
    </html>
  );
}
