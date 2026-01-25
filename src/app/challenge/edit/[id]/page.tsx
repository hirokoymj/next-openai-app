import EditForm from './EditForm';
import { getUserById } from '../../actions';
import { User, FormState } from '../../types';

export default async function EditFormPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const user = await getUserById(Number(id));

  return (
    <div>
      <h2>Edit User - {id}</h2>
      <EditForm user={user} />
    </div>
  );
}
