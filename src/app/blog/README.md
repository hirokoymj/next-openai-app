# Fetching data

- actions.ts vs routes.ts
  GET POST

**My Question**

- Server component without route.ts
- app/api/users/route.ts vs actions.ts
- Next.js RESTful API

When you fetch data in Server Components, the data is fetched and rendered on the server for each request.

## Server components with streaming

When you fetch data in Server Components, the data is fetched and rendered on the server for each request. If you have any slow data requests, the whole route will be blocked from rendering until all the data is fetched. To improve the initial load time and user experience, you can use streaming to break up the page's HTML.

```ts
import { Suspense } from 'react';

interface Post {
  id: number;
  title: string;
}

export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog');
  const posts = await data.json();
  return (
    <Suspense fallback={<p>...loading</p>}>
      <ul>
        {posts.map((post: Post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </Suspense>
  );
}
```

## Client components

**Community libraries**

- You can use a community library like SWR or React Query to fetch data in Client Components. These libraries have their **own** semantics for caching, streaming, and other features.

```js
export default function Page() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['blog'],
    queryFn: async () => {
      const res = await fetch(`https://api.vercel.app/blog'`);
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map(({ id, title }: Post) => (
        <li key={id}>{title}</li>
      ))}
    </ul>
  );
}
```

# Error Handling

**Server Function**
You can use the useActionState hook to handle expected errors in Server Functions.
For these errors, avoid using try/catch blocks and throw errors. Instead, model expected errors as return values.

```ts
//app/actions.ts
'use server';

export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title');
  const content = formData.get('content');

  const res = await fetch('https://api.vercel.app/posts', {
    method: 'POST',
    body: { title, content },
  });
  const json = await res.json();

  if (!res.ok) {
    return { message: 'Failed to create post' };
  }
}
```

**Server Components**

When fetching data inside of a Server Component, you can use the response to conditionally render an error message or redirect.

```js
//app/page.tsx
export default async function Page() {
  const res = await fetch(`https://...`);
  const data = await res.json();

  if (!res.ok) {
    return 'There was an error.';
  }

  return '...';
}
```

Next.js Error handling

**Server Functions**

- https://nextjs.org/docs/app/getting-started/error-handling#server-functions
- You can use the useActionState hook to handle expected errors in Server Functions. For these errors, avoid using try/catch blocks and throw errors. Instead, model expected errors as return values.
- actions.ts is a common file naming convention used to store Server Actions.

```ts
//app/actions.ts
'use server'

export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title')
  const content = formData.get('content')

  const res = await fetch('https://api.vercel.app/posts', {
    method: 'POST',
    body: { title, content },
  })
  const json = await res.json()

  if (!res.ok) {
    return { message: 'Failed to create post' }
  }
}
//app/ui/form.tsx
'use client'

import { useActionState } from 'react'
import { createPost } from '@/app/actions'

const initialState = {
  message: '',
}

export function Form() {
  const [state, formAction, pending] = useActionState(createPost, initialState)

  return (
    <form action={formAction}>
      <label htmlFor="title">Title</label>
      <input type="text" id="title" name="title" required />
      <label htmlFor="content">Content</label>
      <textarea id="content" name="content" required />
      {state?.message && <p aria-live="polite">{state.message}</p>}
      <button disabled={pending}>Create Post</button>
    </form>
  )
}
```

**Server components**

- https://nextjs.org/docs/app/getting-started/error-handling#server-components
- When fetching data inside of a Server Component, you can use the response to conditionally render an error message or redirect.

```ts
//app/page.tsx
export default async function Page() {
  const res = await fetch(`https://...`);
  const data = await res.json();

  if (!res.ok) {
    return 'There was an error.';
  }

  return '...';
}
```

Server component with fetching + Error Boundary
