# Chaturbo Lead Rescue

Chaturbo Lead Rescue is an MVP for missed-call recovery and AI lead qualification for US roofing, HVAC, plumbing, electrical, landscaping, and cleaning businesses.

## What it does

- Creates contractor businesses in a multi-tenant dashboard
- Assigns Twilio numbers and forwards inbound calls to the owner
- Sends an immediate SMS when the owner misses the call
- Qualifies inbound SMS with one short question at a time
- Stores leads, messages, calls, and owner notifications
- Generates personalized audits, outreach emails, call scripts, and video scripts
- Publishes a public audit page at `/audit/[slug]`
- Runs in mock mode when OpenAI or Twilio are not configured

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Express API
- MongoDB with Mongoose
- Twilio Node SDK
- OpenAI SDK
- Resend email abstraction

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment variables

Copy `.env.example` to the repo root and `apps/api/.env.example` to `apps/api/.env`.

Required basics:

```bash
DATABASE_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/chaturbo_ai_sme
JWT_SECRET=change_me
APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000
ADMIN_EMAIL=demo@chaturbo.local
ADMIN_PASSWORD=password123
```

Optional integrations:

```bash
OPENAI_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_MESSAGING_SERVICE_SID=
TWILIO_DEFAULT_FROM_NUMBER=
RESEND_API_KEY=
FROM_EMAIL=
```

## 3. Run the database migration/seed

This project uses MongoDB, so there is no SQL migration step. Seed the demo data instead:

```bash
npm run seed
```

Seed creates:

- Demo Roofing Company
- Demo HVAC Company
- 5 fake leads
- 3 audit targets
- 1 generated audit
- Demo admin login: `demo@chaturbo.local` / `password123`

## 4. Start the dev servers

API:

```bash
npm run dev:api
```

Web:

```bash
npm run dev:web
```

Open `http://localhost:3000`.

## 5. Configure Twilio webhook URLs

Set the inbound number to these URLs:

- Voice incoming: `{{APP_URL}}/api/twilio/voice/incoming`
- Voice status: `{{APP_URL}}/api/twilio/voice/status`
- SMS incoming: `{{APP_URL}}/api/twilio/sms/incoming`

If you are developing locally, expose the app with ngrok first and use the public ngrok URL as `APP_URL`.

## 6. Test the missed-call flow

1. Log in at `/login`
2. Open the seeded Demo Roofing Company in `/dashboard/businesses`
3. Make sure the Twilio number is assigned
4. Call the Twilio number
5. Do not answer the forwarded call
6. Wait for the automatic SMS text-back
7. Reply with a job request
8. Watch the lead update in `/dashboard/leads`

## 7. Generate an audit

1. Open `/dashboard/audits/new`
2. Add a contractor prospect
3. Crawl the website
4. Generate the audit
5. Copy the cold email, follow-up emails, call script, and video script
6. Share the public audit page link

## 8. Convert an audit target to a business

Open the audit target detail page and click `Convert to business`. The app creates a new contractor client record from the prospect data.

## 9. Notes on compliance

- The app only texts people who called or replied to a business
- STOP, START, UNSTOP, CANCEL, END, QUIT, and UNSUBSCRIBE are handled
- First SMS includes opt-out language
- No cold SMS blasting is implemented
- The crawler only fetches the public homepage URL entered by the admin

## 10. Build and lint

```bash
npm run build
npm run lint
```

## Production checklist

- Replace placeholder Terms and Privacy copy
- Add final billing and payment flows
- Configure real Twilio numbers per business
- Add production webhook and ngrok replacement URLs
- Decide whether to keep seeded demo credentials or force admin provisioning
- Review SMS and email compliance before launch
