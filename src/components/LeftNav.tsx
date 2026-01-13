'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiOpenaiFill } from 'react-icons/ri';
import { RiGeminiLine } from 'react-icons/ri';

interface LeftNavProps {
  href: string;
  title: string;
  provider?: 'openai' | 'gemini';
}

export default function LeftNav({ href, title, provider }: LeftNavProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === '/' && href === '/filesearch');

  const icon =
    provider === 'openai' ? (
      <RiOpenaiFill className="text-green-600" />
    ) : provider === 'gemini' ? (
      <RiGeminiLine className="text-blue-600" />
    ) : null;

  return (
    <li>
      <Link
        href={href}
        className={`flex items-center gap-2 px-4 py-2 mb-2 rounded transition-colors duration-200
          ${
            isActive
              ? 'bg-blue-600 text-white font-semibold'
              : 'text-gray-700 hover:bg-gray-200'
          }`}>
        {icon}
        <span>{title}</span>
      </Link>
    </li>
  );
}
