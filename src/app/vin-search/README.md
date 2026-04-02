# Vin number Search (03/30)

## Server Action vs Router Hander

### 1. Server Action + useActionState

Next.js supports forms that call Server Actions, and useActionState is the recommended hook in current React/Next.js guidance.

### 2. Route Handler (app/api/.../route.ts) + client fetch

This is also common if you want your portfolio app to expose a small backend endpoint and keep external API details off the client.

**For your case, I would use a Server Action because:**

- it feels similar to your current form-based code,
- the VIN API call runs on the server,
- you do not expose your API base URL logic directly in the browser,
  and Next.js explicitly supports forms with Server Actions and useActionState

##
