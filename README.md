# QuoteGuard Home

Mobile-first MVP for reviewing home repair quotes before approval.

## Run locally

```powershell
npm.cmd install
npm.cmd run dev
```

Open `http://127.0.0.1:3000`.

## OpenAI setup

Create `.env.local`:

```powershell
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4.1-mini
```

If `OPENAI_API_KEY` is not set, the quote check flow uses the local scoring fallback in `lib/report.ts`.

Users can also choose **OpenAI** or **Claude** on the `/check` page and enter their own API key. Those user-entered keys are stored only in that browser's local storage and sent with the report request.

Optional server fallback keys:

```powershell
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4.1-mini
ANTHROPIC_API_KEY=your_anthropic_key
ANTHROPIC_MODEL=claude-sonnet-4-5
```

## Supabase setup

Supabase is wired as an optional backend layer. The app still works without it.

Add these to `.env.local` when you create a Supabase project:

```powershell
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

Starter clients:

- Browser client: `lib/supabase/browser.ts`
- Server client: `lib/supabase/server.ts`
- Types: `lib/supabase/types.ts`

Starter saved-report schema:

```powershell
supabase/schema.sql
```

Run that SQL in the Supabase SQL editor after choosing a project. The table uses RLS and authenticated-user policies so saved reports can be added later without exposing private user data.

## Vercel setup

This project is Vercel-ready with `vercel.json`.

Required Vercel environment variables:

```powershell
OPENAI_API_KEY
OPENAI_MODEL
ANTHROPIC_API_KEY
ANTHROPIC_MODEL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Deploy options:

```powershell
npx vercel
npx vercel --prod
```

If you link the project locally first:

```powershell
npx vercel link
npx vercel env pull .env.local
```

## Pages

- `/` landing page
- `/sample-report` sample drywall report
- `/check` quote check flow
- `/report` report page shell
- `/articles` SEO article index
- `/articles/what-should-a-home-repair-quote-include`
- `/articles/contractor-quote-red-flags`
- `/articles/drywall-repair-quote-checklist`
- `/articles/questions-to-ask-before-hiring-a-handyman`
