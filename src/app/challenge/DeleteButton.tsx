'use client';
import { useTransition } from 'react';
import { deleteUser } from './actions';

export function DeleteButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => deleteUser(id))}>
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
