'use client';
import { useActionState } from 'react';
import { editUser } from '../../actions';

export default function EditForm({ user }: { user: any }) {
  const [state, formAction, isPending] = useActionState(editUser, null);

  return (
    <form
      action={formAction}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '300px',
      }}>
      <input type="hidden" name="id" value={user.id} />

      <input
        name="firstName"
        defaultValue={user.firstName}
        placeholder="First Name"
      />
      <input
        name="lastName"
        defaultValue={user.lastName}
        placeholder="Last Name"
      />

      <button type="submit" disabled={isPending}>
        {isPending ? 'Updating...' : 'Save Changes'}
      </button>
    </form>
  );
}
