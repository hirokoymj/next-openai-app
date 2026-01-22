'use client';
import { useActionState } from 'react';
import { submitUserForm } from '../actions';
import Link from 'next/link';

export default function RegistrationPage() {
  const [state, formAction, isPending] = useActionState(submitUserForm, null);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Add New User</h2>

      <form
        action={formAction}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          width: '300px',
        }}>
        <input name="firstName" placeholder="First Name" disabled={isPending} />
        <input name="lastName" placeholder="Last Name" disabled={isPending} />

        <button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Register User'}
        </button>

        <Link href="/">Cancel</Link>
      </form>

      {state?.message && (
        <p style={{ color: 'red', marginTop: '15px' }}>{state.message}</p>
      )}
    </div>
  );
}
