# TAST website

Next.js (App Router) site for the Taiwanese Association of Students at Tufts (TAST). See `IMPLEMENTATION_ROADMAP.md` for phased work.

## Local setup

1. Copy `.env.example` to `.env.local` and add your Supabase project URL and publishable key.
2. Install dependencies: `npm install`
3. Start the app: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

Never put the service-role key in `NEXT_PUBLIC_` variables or client code.
