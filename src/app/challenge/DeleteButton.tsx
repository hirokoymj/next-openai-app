'use client';
import { useTransition } from 'react';
import { deleteUser } from './actions';

export function DeleteButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteUser(id);
    });
  };

  return (
    <button disabled={isPending} onClick={handleDelete}>
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
