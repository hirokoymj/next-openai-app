import Link from 'next/link';

export default async function UserDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log('UserDetail');
  console.log(id);

  const res = await fetch(`http://localhost:3000/api/users/${id}`);
  const user = await res.json();
  console.log(user);

  return (
    <div>
      <h1>{user.name}</h1>
      <p>ID: {user.id}</p>

      <Link href={`/users/${id}/edit`}>✏️ Edit</Link>
    </div>
  );
}
