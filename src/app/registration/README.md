**Summary (final)**

- **Server Actions (actions.ts)** : POST mutations (Create/Update/Delete). Use with `<form action> or startTransition`
- **Server Functions (actions.ts)**: Standard async functions for fetching data - `async/await`.
- **revalidatePath**: Clears the server cache to show updated data after a mutation.
- **Component Split**: Server (Data fetching) vs Client (state)
- **Server Components (default)**: Zero JS sent to the client; **Direct DB ACCESS**
- **Client Component**: useState, useEffect, a Custom Hook.
- **useActionState**: For Forms - returns states, formAction, isPending.
- **useTransition**: For Buttons with Server Actions. Returns `isPending` and `startTransition`.
- **Dynamic Routes**: `const { id } = await params`
- **Route Handler (route.ts)**: External API, `fetch('/api/...')` from anywhere.

<hr />

Demo app:

| Feature                   | Defined In          | Used For           | Called Via                                    |
| ------------------------- | ------------------- | ------------------ | --------------------------------------------- |
| Server Action             | actions.ts          | Writing Data       | `<form action>` or `startTransition`          |
| Server Function           | actions.ts or utils | Reading Data       | Direct `await` in Server Components           |
| Server / Client Component | Component file      | Rendering Strategy | Server Component (default) ⇄ Client Component |
| Route Handler             | route.ts            | External API       | `fetch('/api/...')` from anywhere             |

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

# Dynamic Routes (params)

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
