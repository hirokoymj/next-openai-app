import { getUsers } from './actions';

export default async function UsersList() {
  const users = await getUsers(); // 👈 already awaited
  return (
    <ul>
      {users.map(({ id, firstName, lastName, gender, email, city }) => (
        <li
          key={
            id
          }>{`${id}. ${firstName}, ${lastName}, ${gender}, ${email}, ${city}`}</li>
      ))}
    </ul>
  );
}
