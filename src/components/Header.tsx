import Link from 'next/link';
import { AiFillGithub } from 'react-icons/ai';

export default function Header() {
  return (
    <header className="bg-blue-900 text-white p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          Next.js 16 + OpenAI + TanStack Query demo
        </h1>

        <Link
          href="https://github.com/hirokoymj/next-openai-app"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open source on GitHub"
          className="text-white hover:text-gray-200 transition">
          <AiFillGithub size={45} />
        </Link>
      </div>
    </header>
  );
}
