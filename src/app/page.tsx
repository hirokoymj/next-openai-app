import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Welcome to My App</h1>
      <ul style={{ marginTop: '1rem', lineHeight: '2rem' }}>
        <li>
          <Link href="/users">👤 Users</Link>
        </li>
      </ul>
    </main>
  );
}
