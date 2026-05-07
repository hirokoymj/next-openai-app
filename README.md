# Next.js Fullstack development for AI apps

**Live URL:** [ai.hirokoymj.com](https://ai.hirokoymj.com)

## Tech Stack

**Frontend**

- React.js
- Material UI (MUI)
- Form submission: React hooks (`useActionState`)
- Vehicle API

**Backend**

- Next.js 16 (App Router)
- Server Actions (actions.ts)
- Google Gemini 2.5 Flash
- OpenAI GPT-5.0 models
- TanStack Query v5
- Supabase database
- Vercel (Build and deployment)

---

## Deployment on Vercel

- **Custom domain**:
  - Domain Registar: Cheap-Domain Registration.
  - Added a subdomain in the DNS records - [ai.hirokoymj.com](https://ai.hirokoymj.com)
  - Updated live URL: `https://[projectID].vercel.app/` -> `ai.hirokoymj.com`.
- **GitHub App**: Enables auto-deployment on push events to the `main` branch.

"Updated live URL: https://[projectID].vercel.app/ → ://hirokoymj.com."

---

## Github Actions

Pings Supabase on a schedule (Sunday and Friday) to prevent the free-tier project from going inactive.

**Test locally**

```bash
source .env
curl -X GET "$SUPABASE_URL/rest/v1/users?select=id&limit=1" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY"
```

**Schedule**

The workflow runs automatically **twice a week**:

| Day    | Time         |
| ------ | ------------ |
| Sunday | 12:00 AM UTC |
| Friday | 12:00 AM UTC |

## Supabase

**Create a policy**

- Supabase Dashboard -> Authentication -> Policies -> [table] -> Create a policy
- **Policy type**: `SELECT`, **Target roles**: `anon`, **Using expression**: `true`
- Row Level Security (RLS) enabled
- This only allows reading (no write, no delete)

### Pages Router - SSG (Static Site Generation) with `getStaticProps`

Next.js Pages Router — File-based Routing

- src/pages/claims.tsx /claims
  src/pages/index.tsx /
  src/pages/about.tsx /about
  src/pages/blog/post.tsx /blog/post

Runs at build time on the server
Returns props that are passed directly to the component
The browser only receives the pre-rendered HTML — no JS fetch, no loading state

- The right approach is to extract the full nav into a shared component so both app/layout.tsx and pages/\_app.tsx use the same source. Let me read the LeftNav component first.

| Feature                           | SSG (getStaticProps)                | SSR (getServerSideProps)            |
| --------------------------------- | ----------------------------------- | ----------------------------------- |
| Runs                              | Once at build time                  | On every request                    |
| Data                              | Same for all users                  | Can be request-specific             |
| Performance                       | Fastest (pre-built HTML)            | Slower (server work per request)    |
| Use case                          | Static content, marketing pages     | User-specific data, real-time data  |
| Other frameworks that support SSR | Next.js, Nuxt.js, Angular Universal | Next.js, Nuxt.js, Angular Universal |

---

#### References:

- [Vercel dashboard](https://vercel.com/hirokoymjs-projects)
- [Supabase dashboard](https://supabase.com/dashboard)
- [Google Cloud: API key restrictions](https://docs.cloud.google.com/docs/authentication/api-keys#api_key_restrictions)
- [Next.js](https://nextjs.org/docs/app/getting-started/updating-data)
- [Medium: How to Keep Supabase Free Tier Projects Active](https://shadhujan.medium.com/how-to-keep-supabase-free-tier-projects-active-d60fd4a17263)
