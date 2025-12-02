'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import UserList from './components/UserList';
import { PageHeader } from '@/components/PageHeader';

const headerInfo = {
  title: 'User List',
  repoUrl:
    'https://github.com/hirokoymj/next-openai-app/blob/main/src/app/users/page.tsx',
  stack: ['Next.js', 'Full CRUD', 'RESTful API', 'TansStack Query', 'Supabase'],
};

export default function UserListPageClient() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['users', page, sortBy, sortOrder, debouncedSearch],
    queryFn: async () => {
      const res = await fetch(
        `/api/users?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${debouncedSearch}`
      );
      return res.json();
    },
  });

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error loading users</div>;

  const { users, totalPages } = data;

  return (
    <div className="max-w-6xl mx-auto mt-4 px-4">
      <PageHeader headerInfo={headerInfo} />

      <div className="mb-4 flex items-center gap-2">
        <Link
          href="/users/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Add New User
        </Link>

        <input
          type="text"
          placeholder="Search by name…"
          className="border rounded px-3 py-2 flex-1"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      <UserList
        users={users}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(column) => {
          if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          } else {
            setSortBy(column);
            setSortOrder('asc');
          }
        }}
      />

      {/* Pagination Buttons */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
          ← Prev
        </button>

        <span className="px-4 py-2">
          Page {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
          Next →
        </button>
      </div>
    </div>
  );
}
