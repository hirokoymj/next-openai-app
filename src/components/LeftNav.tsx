'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiOpenaiFill } from 'react-icons/ri';
import { RiGeminiLine } from 'react-icons/ri';

interface LeftNavProps {
  href: string;
  title: string;
}

{
  /* <RiGeminiLine />
	
	<RiOpenaiFill />
	
	*/
}

export default function LeftNav({ href, title }: LeftNavProps) {
  const currentUrl = usePathname(); // get current path
  const isActive = currentUrl?.startsWith(href);

  return (
    <li>
      <Link
        href={href}
        className={`block px-4 py-2 mb-2 rounded transition-colors duration-200
          ${
            isActive
              ? 'bg-blue-600 text-white font-semibold'
              : 'text-gray-700 hover:bg-gray-200'
          }`}>
        {title}
      </Link>
    </li>
  );
}
