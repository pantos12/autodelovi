# autodelovi.sale — Backend Architecture

## Stack

```
┌─────────────────────────────────────────┐
│         VERCEL (Edge + Node.js)         │
│  Next.js 14 App Router + API Routes     │
│  /api/parts  /api/search  /api/scrape   │
│  /api/cron/scrape-all  /api/cron/prices │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│              SUPABASE                   │
│  PostgreSQL + Full-text + RLS           │
│  parts, suppliers, price_history        │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         SCRAPING PIPELINE               │
│  Fetch → Normalize → Upsert → Monitor  │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         RUFLO / CLAUDE-FLOW             │
│  npx claude-flow run autodelovi-pipeline│
└─────────────────────────────────────────┘
```

## Quick Start

1. Create Supabase project → run `supabase/migrations/001_initial_schema.sql`
2. Copy `.env.example` → `.env.local`, fill in Supabase keys
3. `npm install`
4. Seed demo data: `npx ts-node scripts/run-pipeline.ts --demo`
5. Real scrape: `npx ts-node scripts/run-pipeline.ts --supplier autodoc-rs`

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/parts` | — | List/filter parts |
| GET | `/api/parts/:id` | — | Single part + related |
| GET | `/api/search?q=` | — | Full-text search |
| GET | `/api/suppliers` | — | List suppliers |
| GET | `/api/prices/:partId` | — | Price history |
| POST | `/api/scrape` | Bearer token | Trigger scrape |
| GET | `/api/cron/scrape-all` | Cron secret | Daily full scrape |
| GET | `/api/cron/scrape-prices` | Cron secret | 6h price update |

## Vercel Cron (vercel.json)
- `0 4 * * *` → `/api/cron/scrape-all` (daily at 04:00 UTC)
- `0 */6 * * *` → `/api/cron/scrape-prices` (every 6 hours)

## RuFlo Workflows

```bash
npx claude-flow run autodelovi-pipeline full-pipeline
npx claude-flow run autodelovi-pipeline price-watch
npx claude-flow run autodelovi-pipeline market-analysis
```

Config: `scripts/claude-flow.json` | Agents: `scripts/agents/`

## Adding a New Supplier

1. Create `lib/scraper/sources/{id}.ts` extending `BaseScraper`
2. Register in `lib/scraper/index.ts` `getScraper()` switch
3. Add supplier row to Supabase
4. Test: `npx ts-node scripts/run-pipeline.ts --supplier {id}`

## Environment Variables

See `.env.example`. Key vars:
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public
- `SUPABASE_SERVICE_ROLE_KEY` — server-only, never expose to browser
- `SCRAPE_API_SECRET` — protects POST /api/scrape
- `CRON_SECRET` — authenticates Vercel cron calls
