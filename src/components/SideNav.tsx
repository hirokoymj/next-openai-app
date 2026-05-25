'use client';

import LeftNav from '@/components/LeftNav';

export default function SideNav() {
  return (
    <nav className="w-50 bg-gray-100 p-4">
      <ul className="list-none p-0">
        <li className="mb-2 text-xs font-semibold text-gray-500 uppercase">
          OpenAI
        </li>
        <LeftNav href="/rag-chat" title="AI - Rag search" provider="openai" />
        <LeftNav
          href="/pdf-chat"
          title="AI - Chat with PDF"
          provider="openai"
        />
        <LeftNav href="/summary" title="AI Summary" provider="openai" />
        <hr className="my-3 border-gray-300" />
        <li className="mb-2 text-xs font-semibold text-gray-500 uppercase">
          Vehicle API
        </li>
        <LeftNav href="/vin-search" title="Vin Search" />
        <hr className="my-3 border-gray-300" />
        <li className="mb-2 text-xs font-semibold text-gray-500 uppercase">
          RESTful API
        </li>
        <LeftNav href="/users" title="User List" />
        <hr className="my-3 border-gray-300" />
        <li className="mb-2 text-xs font-semibold text-gray-500 uppercase">
          Static Page (SSG)
        </li>
        <LeftNav href="/claims" title="Claims" />
        <LeftNav href="/about" title="About" />
      </ul>
    </nav>
  );
}
