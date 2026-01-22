'use client';
import { useTransition, useState } from 'react';
import { deleteUser } from './actions';

export function DeleteButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleDelete = () => {
    startTransition(async () => {
      await deleteUser(id);
      closeModal();
    });
  };

  return (
    <div style={{ display: 'inline' }}>
      <button onClick={openModal} style={{ marginLeft: '10px' }}>
        Delete
      </button>

      {isOpen && (
        <div
          style={{
            border: '1px solid black',
            padding: '10px',
            marginTop: '10px',
            background: '#fff',
          }}>
          <p>Are you sure to delete this user?</p>
          <button
            onClick={handleDelete}
            disabled={isPending}
            style={{ color: isPending ? 'gray' : 'red' }}>
            {isPending ? 'Deleting...' : 'Yes, Delete'}
          </button>
          <button onClick={closeModal} disabled={isPending}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
