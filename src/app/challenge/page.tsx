import { getUsers } from './actions';
import Link from 'next/link';
import { DeleteButton } from './DeleteButton';

export default async function UserListPage() {
  const users = await getUsers();
  return (
    <div>
      <Link href="/challenge/add-form">Add New User</Link>
      <ul>
        {users.map(({ id, firstName, lastName }) => (
          <li key={id}>
            {id}. {firstName} {lastName} -
            <DeleteButton id={id} />,
            <Link href={`/challenge/edit/${id}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
