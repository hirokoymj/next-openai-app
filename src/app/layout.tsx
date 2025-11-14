import Link from 'next/link';
import './globals.css';
import LeftNav from './components/LeftNav';

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
          <h1>Next.js (v16) CRUD demo</h1>
        </header>
        <div style={{ display: 'flex', minHeight: '90vh' }}>
          <nav
            style={{ width: '200px', background: '#f3f4f6', padding: '1rem' }}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <LeftNav href="/users" title="Users" />
              <LeftNav href="/todos" title="Todos" />
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
          }}>
          © 2025 Hiroko CRUD App
        </footer>
      </body>
    </html>
  );
}
