import { getUsers } from './actions';
import { DeleteButton } from './DeleteButton';
import Link from 'next/link';

export default async function UserListPage() {
  const userList = await getUsers();

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>User Directory</h1>

      {/* Navigation to the Form */}
      <Link href="/registration/register-form">
        <button
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            marginBottom: '20px',
          }}>
          + Register New User
        </button>
      </Link>

      <ul
        style={{
          background: '#f9f9f9',
          padding: '20px',
          borderRadius: '8px',
          listStyle: 'none',
        }}>
        {userList.length === 0 && <p>No users found.</p>}
        {userList.map((user) => (
          <li
            key={user.id}
            style={{
              marginBottom: '10px',
              borderBottom: '1px solid #eee',
              paddingBottom: '10px',
            }}>
            <strong>
              {user.firstName} {user.lastName}
            </strong>
            <DeleteButton id={user.id} />
            <Link
              href={`/registration/edit/${user.id}`}
              style={{ marginLeft: '10px' }}>
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
