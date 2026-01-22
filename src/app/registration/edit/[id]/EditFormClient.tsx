'use client';
import { useActionState } from 'react';
import { updateUser } from '../../actions';

export default function EditFormClient({ user }: { user: any }) {
  const [state, formAction, isPending] = useActionState(updateUser, null);

  return (
    <form
      action={formAction}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '300px',
      }}>
      {/* Hidden input to pass the ID to the server action */}
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
