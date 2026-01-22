import { getUserById } from '../../actions';
import EditFormClient from './EditFormClient';
import { notFound } from 'next/navigation';

export default async function EditPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const user = await getUserById(Number(id));

  if (!user) {
    notFound(); // Shows the Next.js 404 if user doesn't exist
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Edit User</h2>
      <EditFormClient user={user} />
    </div>
  );
}
