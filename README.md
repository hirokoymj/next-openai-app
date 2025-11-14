## Next.js (v16) - 11/12

**References:**

- https://nextjs.org/docs/app/getting-started/installation
- https://nextjs.org/docs/app/getting-started/css#tailwind-css
- https://nextjs.org/docs/app/api-reference/file-conventions/route#http-methods
- https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes

**App Router, Page Router**

- https://nextjs.org/docs/app/getting-started/project-structure?utm_source=chatgpt.com#top-level-folders

**not-found.js**

- https://nextjs.org/docs/app/api-reference/file-conventions/not-found

## Next.js (v16) + RESTful API

✅ File-system routing (/users, /todos)
✅ Page components (page.tsx)
✅ Dynamic routes ([id]/page.tsx)
✅ API routes (route.ts)
✅ Custom 404 page (not-found.tsx)

```js
open -a "DB Browser for SQLite" prisma/dev.db
```

- GET: https://jsonplaceholder.typicode.com/users
- GET: https://jsonplaceholder.typicode.com/users/1
- POST: https://jsonplaceholder.typicode.com/users
- PUT: https://jsonplaceholder.typicode.com/users/1
- DELETE: https://jsonplaceholder.typicode.com/users/1

| Feature              | URLn(fetch)       | File                           |
| -------------------- | ----------------- | ------------------------------ |
| GET (all user)       | `/api/users`      | `app/api/users/route.ts`       |
| GET (detail)         | `/api/users/[id]` | `app/api/users/[id]/route.ts`  |
| POST (Create user)   | `/api/users`      | `app/api/users/route.ts`       |
| PUT (Edit user)      | `/api/users/[id]` | `app/api/users/[id]/route.tsx` |
| DELETE (Delete user) | `/api/users/[id]` | `app/api/users/[id]/route.tsx` |

## Next.js (v16) + Prisma + SQLite

| Feature       | URL               | File                          |
| ------------- | ----------------- | ----------------------------- |
| List all user | `/api/items`      | `app/api/items/route.ts`      |
| Get one user  | `/api/items/[id]` | `app/api/items/[id]/route.ts` |
| Edit one user | `/items/[id]`     | `app/items/[id]/page.tsx`     |
| Edit one user | `/items/[id]`     | `app/items/[id]/page.tsx`     |

## Next.js

**Installation**

- https://nextjs.org/docs/app/getting-started/installation

```js
npx create-next-app@latest my-app --yes
cd my-app
npm run dev

Would you like to use TypeScript? No / Yes
Which linter would you like to use? ESLint / Biome / None
Would you like to use React Compiler? No / Yes
Would you like to use Tailwind CSS? No / Yes
Would you like your code inside a `src/` directory? No / Yes
Would you like to use App Router? (recommended) No / Yes
Would you like to customize the import alias (`@/*` by default)? No / Yes
What import alias would you like configured? @/*
```

**Tailwind CSS**

- https://nextjs.org/docs/app/getting-started/css#tailwind-css

```js
npm install -D tailwindcss @tailwindcss/postcss
//postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
//app/globals.css
@import 'tailwindcss';
//app/layout.tsx
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
//app/page.tsx
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
    </main>
  )
}
```

**Next.js + App Router**

**HTTP Methods**
https://nextjs.org/docs/app/api-reference/file-conventions/route#http-methods

**Dynamic Route Segments**
https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes

| Feature          | URL               | File                          |
| ---------------- | ----------------- | ----------------------------- |
| List all items   | `/api/items`      | `app/api/items/route.ts`      |
| Get one item     | `/api/items/[id]` | `app/api/items/[id]/route.ts` |
| Detail view page | `/items/[id]`     | `app/items/[id]/page.tsx`     |

<br />

## Form (CRUD) - 11/09

- Create POST /api/items
- Read GET /api/items
- Update PUT /api/items
- Delete DELETE /api/items

## useActionState example

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
