'use client';

import { useFormState } from 'react-dom';
import { createUser, FormState } from './actions';

const initialState: FormState = {};

export default function UserForm() {
  const [state, formAction] = useFormState(createUser, initialState);

  return (
    <form action={formAction}>
      <input name="firstName" placeholder="First name" />
      {state.errors?.firstName && <p>{state.errors.firstName}</p>}

      <input name="lastName" placeholder="Last name" />
      {state.errors?.lastName && <p>{state.errors.lastName}</p>}

      <label>
        <input type="radio" name="gender" value="male" /> Male
      </label>
      <label>
        <input type="radio" name="gender" value="female" /> Female
      </label>
      {state.errors?.gender && <p>{state.errors.gender}</p>}

      <input type="email" name="email" placeholder="Email" />
      {state.errors?.email && <p>{state.errors.email}</p>}

      <input name="city" placeholder="City" />
      {state.errors?.city && <p>{state.errors.city}</p>}

      <button type="submit">Create User</button>

      {state.success && <p>User created successfully ✅</p>}
    </form>
  );
}
