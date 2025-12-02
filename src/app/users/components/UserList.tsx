'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '@/types';

export default function UserList({
  users,
  sortBy,
  sortOrder,
  onSortChange,
}: {
  users: User[];
  sortBy: string;
  sortOrder: string;
  onSortChange: (item: string) => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient(); // Get the query client
  const sortSymbol = sortOrder === 'asc' ? '▲' : '▼';

  const { mutate, isError, isPending } = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      router.refresh();
    },
    onError: (error) => {
      console.error('Deletion failed:', error);
    },
  });

  const handleDelete = async (id: number) => {
    mutate(id);
  };

  if (isError) return <div>Error fetching users.</div>;

  return (
    <div>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border" onClick={() => onSortChange('id')}>
              ID {sortBy === 'id' && sortSymbol}
            </th>
            <th
              className="p-2 border cursor-pointer"
              onClick={() => onSortChange('firstName')}>
              First Name {sortBy === 'firstName' && sortSymbol}
            </th>

            <th
              className="p-2 border cursor-pointer"
              onClick={() => onSortChange('lastName')}>
              Last Name {sortBy === 'lastName' && sortSymbol}
            </th>
            <th className="p-2 border">Gender</th>

            <th
              className="p-2 border cursor-pointer"
              onClick={() => onSortChange('email')}>
              Email {sortBy === 'email' && sortSymbol}
            </th>

            <th
              className="p-2 border cursor-pointer"
              onClick={() => onSortChange('city')}>
              City {sortBy === 'city' && sortSymbol}
            </th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="p-2 border">{u.id}</td>
              <td className="p-2 border">{u.firstName}</td>
              <td className="p-2 border">{u.lastName}</td>
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
                  🗑 {isPending ? 'Deleting' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
