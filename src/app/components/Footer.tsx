import Link from 'next/link';
import { AiFillGithub } from 'react-icons/ai';

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white p-4 text-center flex flex-col items-center justify-center gap-1">
      <span>© 2025 Hiroko Yamaji. Built with Next.js and OpenAI.</span>
      <Link
        href="https://github.com/hirokoymj/next-openai-app"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open source on GitHub"
        className="inline-flex text-white">
        <AiFillGithub size={30} />
      </Link>
    </footer>
  );
}
