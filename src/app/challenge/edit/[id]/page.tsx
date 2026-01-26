import EditForm from './EditForm';
import { getUserById } from '../../actions';
import { notFound } from 'next/navigation'; // 1. Import notFound

export default async function EditFormPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const user = await getUserById(Number(id));

  if (!user) {
    notFound();
  }

  return (
    <div>
      <h2>Edit User - {id}</h2>
      <EditForm user={user} />
    </div>
  );
}
