# actions.ts

- Server Actions let you call backend code from React without manually creating or calling an API endpoint.
- actions.ts lets me write backend database logic and trigger it from a React component without manually creating or calling an API endpoint.
- Server Actions hide HTTP and expose the server as a function call.

Loading
https://nextjs.org/docs/app/getting-started/fetching-data#with-loadingjs

Error handling

# Server Action

✅ This is standard HTML + new Next.js behavior

```js
<form action={createUser}></form>
export async function createUser(formData: FormData) {
  const firstName = formData.get('firstName');
}
```

🧠 Correct understanding

- <form action={serverAction}> is HTML form submission, but Next.js replaces the URL with a server function.

onSubmit = Client-side JavaScript

```js
function handleSubmit(e) {
  e.preventDefault();
  fetch('/api/users', { method: 'POST' });
}
```

🧠 Key phrase (memorize this)

onSubmit is client-side form handling.
action={} is server-side form handling.

This is the new recommended default in Next.js.

## Server Action form (uncontrolled inputs)

- ❌ No useState
- ❌ No onChange
- ✅ Browser handles form state
- ✅ Data collected automatically

```ts
<form action={createUser}>
  <input name="name" />
</form>
```
