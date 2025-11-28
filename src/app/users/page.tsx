import Link from 'next/link';
import UserList from './components/UserList';
import { User } from '@/types/user';

export default async function UserListPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
    cache: 'no-store',
  });

  const users: User[] = await res.json();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <Link
        href="/users/new"
        className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Add New User
      </Link>
      {users && <UserList users={users} />}
    </div>
  );
}
