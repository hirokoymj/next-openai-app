import { Suspense } from 'react';
import UsersList from './UsersList';
import UserForm from './UserForm';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <>
      <UserForm />
      <hr />
      <Suspense fallback={<p>...loading</p>}>
        <UsersList />
      </Suspense>
    </>
  );
}
