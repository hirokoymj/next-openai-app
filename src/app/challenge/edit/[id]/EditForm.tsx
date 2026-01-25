'use client';
import { useActionState } from 'react';
import { editUser } from '../../actions';
import { User } from '../../types';

const EditForm = ({ user }: { user: User }) => {
  const [state, formAction, isPending] = useActionState(editUser, null);
  return (
    <div>
      EditForm
      <form action={formAction}>
        <input type="hidden" name="id" value={user.id} />
        <label>
          FirstName:
          <input type="text" name="firstName" defaultValue={user.firstName} />
        </label>
        <label>
          Last Name:
          <input type="text" name="lastName" defaultValue={user.lastName} />
        </label>
        <hr />

        <button type="submit" disabled={isPending}>
          {isPending ? 'Editing...' : 'Edit'}
        </button>
      </form>
    </div>
  );
};

export default EditForm;
