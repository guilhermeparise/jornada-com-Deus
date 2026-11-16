---
name: initial-exploration
description: Explored the project structure, tech stack, and core logic for the 'jornada-com-deus' devotional tracker.
metadata:
  type: project
---

[[jornada-com-deus]] is a Next.js application that provides daily devotionals to users, tracking their progress, streaks, and completion via Supabase.

**Summary of Exploration:**
- Tech Stack: Next.js (TypeScript), Tailwind CSS, Supabase.
- Project Goal: Daily devotional companion.
- Core Logic: `src/lib/devotional-dates.ts` manages dates, streaks, and devotional mapping.
- Dashboard: `src/app/page.tsx` fetches data from Supabase and renders the user's progress.
- Key Configs: `next.config.ts`, `tsconfig.json`.

**Observations:**
- The project is well-structured using Next.js App Router.
- Uses `process.env.NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for auth and database interactions.
- Logic is cleanly separated into `lib/` files.
