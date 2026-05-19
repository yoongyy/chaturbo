# Chaturbo

Chaturbo is an AI-agent workflow monetization platform.

## What this platform does

- Scan local AI agent conversation/log files with the CLI
- Sanitize sensitive data locally before upload
- Heuristically extract reusable workflow drafts (no AI API yet)
- Upload only sanitized workflow drafts after user approval
- Review drafts in dashboard and publish selected workflows
- Let local AI agents search/buy workflows and reuse purchased workflows during tasks

## Stack

- Monorepo with npm workspaces
- `apps/web`: Next.js App Router + TypeScript + Tailwind
- `apps/api`: Express + TypeScript + MongoDB Atlas (Mongoose)
- `packages/cli`: TypeScript CLI (`chaturbo`, npm package: `chaturbo-cli`)
- JWT auth with email/password

## 1. Install dependencies

```bash
npm install
```

## 2. Configure MongoDB

Copy env examples and update values:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
cp packages/cli/.env.example packages/cli/.env
```

Required API env vars:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGIN`

Optional CLI override:

- `CHATURBO_API_URL` (default `http://localhost:4000`)

## 3. Start API

```bash
npm run dev:api
```

API routes include:

- Auth: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- Agent credentials: `POST /auth/agent/pair`, `GET /auth/agent/credentials`
- Credits: `GET /credits/balance`, `POST /credits/topup`
- Scan: `POST /scan/upload-drafts` (JWT or agent credentials)
- Drafts: `GET /workflow-drafts`, `GET /workflow-drafts/:id`, `POST /workflow-drafts/:id/publish`, `POST /workflow-drafts/:id/reject`, `DELETE /workflow-drafts/:id` (JWT)
- Workflows: `GET /workflows`, `GET /workflows/:id`, `POST /workflows/search`, `POST /workflows/:id/preflight-check`, `POST /workflows/:id/purchase`
- Agent marketplace runtime: `POST /agent/search`, `GET /agent/balance`, `POST /agent/workflows/:id/purchase`, `GET /agent/library`

## 4. Start web

```bash
npm run dev:web
```

Open `http://localhost:3000`.

## 5. Build CLI

```bash
npm run build --workspace chaturbo-cli
npm link --workspace chaturbo-cli
```

Owner quickstart (without cloning this repo):

```bash
npx -y chaturbo-cli@latest connect --api-url https://api.chaturbo.com --owner-id <owner_uid> --agent-secret <agent_secret>
```

## 6. Login with CLI

```bash
chaturbo login
```

## 7. Fast connect (recommended)

```bash
chaturbo connect --path ./sample-openclaw-logs
```

This one command handles login/session, AI-agent log scan, local draft refinement (optional), draft upload flow, and pairs unattended agent credentials.

## 8. Pair once for scheduled sync

```bash
chaturbo pair
```

This stores:

- `ownerUid` (unique owner/account identifier)
- `agentSecret` (shared secret for non-interactive sync)

## 9. Run unattended sync (cron/task scheduler)

```bash
chaturbo sync
```

Example hourly cron (macOS/Linux):

```bash
0 * * * * /bin/zsh -lc "chaturbo sync"
```

## 10. Run scan command (manual mode)

```bash
chaturbo scan agent --path ./sample-openclaw-logs
```

Optional modes:

```bash
chaturbo scan agent --local-only
chaturbo scan agent --path ./sample-openclaw-logs --local-only
```

## 11. Review drafts in dashboard

Visit:

- `/dashboard`
- `/dashboard/workflow-drafts`
- `/dashboard/workflow-drafts/[id]`
- `/dashboard/workflows`
- `/workflows`

## Seed data (optional)

```bash
npm run seed
```

Seed includes:

- Fix OpenRouter rate limit fallback
- Shopify OAuth callback on Vercel
- Telegram signal to MT5 bridge
- Local LLM Ollama setup
- Vercel + Railway + MongoDB SaaS deploy

Demo login after seeding:

- Email: `demo@chaturbo.dev`
- Password: `password123`

## Root scripts

- `npm run dev:web`
- `npm run dev:api`
- `npm run dev:cli`
- `npm run build`
- `npm run lint`

## Not implemented yet

- Stripe and payments
- Auto-buy flow
- MCP server
- Browser extension
- Workflow purchase flow
- Real AI extraction (heuristic extraction only)
