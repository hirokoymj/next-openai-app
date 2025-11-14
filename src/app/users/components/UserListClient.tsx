'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  city: string;
}

export default function UserListClient({ users }: { users: User[] }) {
  const router = useRouter();

  const handleDelete = async (id: number) => {
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    router.refresh(); // refresh after deletion
  };

  return (
    <table className="min-w-full border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">ID</th>
          <th className="p-2 border">First/Last</th>
          <th className="p-2 border">Gender</th>
          <th className="p-2 border">Email</th>
          <th className="p-2 border">City</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id} className="hover:bg-gray-50">
            <td className="p-2 border">{u.id}</td>
            <td className="p-2 border">{`${u.firstName} ${u.lastName}`}</td>
            <td className="p-2 border">{u.gender}</td>
            <td className="p-2 border">{u.email}</td>
            <td className="p-2 border">{u.city}</td>
            <td className="p-2 border space-x-2">
              <Link
                href={`/users/${u.id}/edit`}
                className="text-blue-600 hover:underline">
                ✏️ Edit
              </Link>
              <button
                onClick={() => handleDelete(u.id)}
                className="text-red-600 hover:underline">
                🗑 Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
