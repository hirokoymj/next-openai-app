'use client';
import { useActionState } from 'react';
import { submitUser } from '../actions';

export default function AddUserForm() {
  const [state, formAction, isPending] = useActionState(submitUser, null);
  return (
    <div>
      <h2>Add New User Form</h2>
      <form action={formAction}>
        <label>FirstName: </label>
        <input type="text" name="firstName" />
        <label>Last Name:</label>
        <input type="text" name="lastName" />
        <hr />
        <button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save'}
        </button>
      </form>
      {state?.message && <p>{state.message}</p>}
    </div>
  );
}
