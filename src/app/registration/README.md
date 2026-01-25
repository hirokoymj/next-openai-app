# Next.js Server Actions Architect

**Summary (final)**

- **Server Actions (actions.ts)** : CRUD(Create/Read/Update/Delete) logic, async/await, Use with `<form action> or startTransition`
- **revalidatePath**: Tells Next.js the data is old. Clears the server cache.
- **Component Split**: Server (Data fetching) vs Client (state, event handlers)
- **Server Components (default)**: Zero JS sent to the client; **Direct DB ACCESS**
- **Client Component**: state - useState, useEffect...
- **useActionState**: For Forms - `[states, formAction, isPending]`
- **useTransition**: For Buttons `[isPending, startTransition]`
- **Dynamic Routes**: `const { id } = await params`
- **Route Handler (route.ts)**: External API, `fetch('/api/...')` from anywhere.

<hr />

**Demo app:**

- http://localhost:3000/registration
- http://localhost:3000/registration/register-form
- http://localhost:3000/registration/edit/1

```js
src/app/
└── registration/
    ├── page.tsx               <-- Server-side fetch
    ├── DeleteButton.tsx       <-- Client component
    ├── actions.ts             <-- Server Actions (CRUD)
    ├── register-form/
    │   └── page.tsx           <-- URL: Create Form
    └── edit/
        └── [id]/
            ├── page.tsx       <-- The Hydrator
            └── EditForm.tsx   <-- Edit Form
```

<hr />

## actions.ts

`submitUser, getUsers, deleteUser, getUserById, updateUser`

<hr />

## useActionState

- handle form state, server action and pending UI.
- `const [state, formAction, isPending] = useActionState(submitUserForm, null)`
- `const [state, formAction, isPending] = useActionState(updateUser, null)`
- state: the return value from the action (initially null)
- formAction: the function to pass to the <form action={...}>
- isPending:
- No state setter function
- `<form action={formAction} />`
- (actions.ts)`export async function submitUserForm() {}`

**Reference:**

- https://react.dev/reference/react/useActionState
- https://nextjs.org/docs/app/getting-started/error-handling#server-functions

<hr />

## useTransition

- For buttons with Server Actions.
- useTransition requires you to manually wrap your function call like startTransition(() => doSomething()).
- `const [isPending, startTransition] = useTransition()`
- `startTransition(action)`
- `startTransition(async () => await deleteUser(id))`

```ts
const [isPending, startTransition] = useTransition();

return (

  <button
    disabled={isPending}
    onClick={() => startTransition(() => deleteUser(id))}>
    {isPending ? 'Deleting...' : 'Delete'}
  </button>
```

**References:**
https://react.dev/reference/react/useTransition

<hr />

## Server Actions ("use server")

- Purpose: "POST" operations (creating, updating, deleting data).
- Best Practice: pair perfectly with useActionState to handle form state and pending UI.
- Bonus: They automatically handle "hidden" security features like CSRF protection for you.

## Server Functions

- Purpose: These are standard asynchronous functions that run on the server.
- Used getUsers() and getUserById() as pure asynchronous functions to fetch data directly on the server.

## Form vs. Button Logic

- **useActionState** is for **Forms** (complex state, error messages).
- **useTransition** is for Buttons/Interactions .

## revalidatePath

- The bridge between "Write" (Action) and "Read" (Component). It tells Next.js to purge the cache and show fresh data.
- `revalidatePath("/")`
- [Next.js revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)
- import { revalidatePath } from 'next/cache';

## Dynamic Routes (params)

- `const { id } = await params`
- https://nextjs.org/docs/messages/sync-dynamic-apis
- From Next.js 16, params are now asynchronous.
  **app/[id]/page.js**

```js
async function Page({ params }) {
  // asynchronous access of `params.id`.
  const { id } = await params;
  return <p>ID: {id}</p>;
}
```

## Data flow

1. Trigger: The user clicks "Save" in the EditFormClient.
2. Action: updateUser runs on the server.
3. Mutation: The users array is updated.
4. Signal: revalidatePath tells Next.js the data is old.
5. Redirect: The browser moves to /registration.
6. Refresh: The Server Component page.tsx re-runs getUsers() and sends the fresh HTML.

##

```js
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
```
