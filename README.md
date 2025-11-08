# useStateAction example

URL: https://react.dev/reference/react/useActionState

**Ex1**

```js
'use client';
import { action } from './actions';
import { useActionState } from 'react';

export default function Home() {
  const [state, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={1} />
      <input
        type="text"
        name="firstName"
        style={{ border: '1px solid green' }}
      />
      <input
        type="text"
        name="lastName"
        style={{ border: '1px solid green' }}
      />
      <button type="submit">{isPending ? 'Submitting' : 'Submit'}</button>
      {state?.message && (
        <p className={state.success ? 'text-green-500' : 'text-red-500'}>
          {state.message}
        </p>
      )}
    </form>
  );
}
//actions.js
export async function action(prevState: any, formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const id = formData.get('id') as string;

  if (firstName.length < 3) {
    return {
      success: false,
      message: 'First name must be at leaset 3 characters long',
    };
  }

  return {
    success: true,
    message: `User ${id} updated to ${firstName}, ${lastName}`,
  };
}
```

**EX2**

```js
import { useActionState } from 'react';

async function increment(previousState, formData) {
  return previousState + 1;
}

function StatefulForm({}) {
  const [state, formAction] = useActionState(increment, 0);
  return (
    <form>
      {state}
      <button formAction={formAction}>Increment</button>
    </form>
  );
}
```

# Why defaultChecked Works

- checked - Fully controlled, React forces the value → user cannot change without onChange
- defaultChecked - Input is uncontrolled → user can change normally, but form still posts value
