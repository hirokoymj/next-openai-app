# Next.js Fullstack development for AI apps

**Live URL:** [ai.hirokoymj.com](https://ai.hirokoymj.com)

## Tech Stack

**Frontend**

- React.js
- Material UI (MUI)
- React hooks: `useActionState`

**Backend**

- Next.js 16 (App Router)
- Server Actions (actions.ts)
- Google Gemini 2.5 Flash
- OpenAI GPT-5.0 models
- TanStack Query v5
- Supabase database
- Vercel (Build and deployment)

---

## Deployment by Vercel

- **Custom domain**:
  - Domain Registar: Cheap-Domain Registration.
  - Added a subdomain in the DNS records - [ai.hirokoymj.com](https://ai.hirokoymj.com)
  - Updated live URL: `https://[projectID].vercel.app/` -> `ai.hirokoymj.com`.
- **GitHub App**: Enables auto-deployment on push events to the `main` branch.

"Updated live URL: https://[projectID].vercel.app/ → ://hirokoymj.com."

---

## Github Actions

A GitHub Actions workflow that automatically pings a Supabase database on a regular schedule to prevent it from going inactive due to inactivity.

```yaml
curl -X GET "${{ secrets.SUPABASE_URL }}/rest/v1/users?select=id&limit=1" \
  -H "apikey: ${{ secrets.SUPABASE_KEY }}" \
  -H "Authorization: Bearer ${{ secrets.SUPABASE_KEY }}"
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

---

#### References:

- [Vercel dashboard](https://vercel.com/hirokoymjs-projects)
- [Supabase dashboard](https://supabase.com/dashboard)
- [Google Cloud: API key restrictions](https://docs.cloud.google.com/docs/authentication/api-keys#api_key_restrictions)
- [Next.js](https://nextjs.org/docs/app/getting-started/updating-data)
- [Medium: How to Keep Supabase Free Tier Projects Active](https://shadhujan.medium.com/how-to-keep-supabase-free-tier-projects-active-d60fd4a17263)
