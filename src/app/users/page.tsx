import Link from 'next/link';
import UserListClient from './components/UserListClient';
import { prisma } from '../../lib/prismaClient';

export default async function UserListPage() {
  const users = await prisma.user.findMany(); // direct DB query

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <Link
        href="/users/new"
        className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Add New User
      </Link>
      <UserListClient users={users} />
    </div>
  );
}
