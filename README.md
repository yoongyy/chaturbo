# Chaturbo

Chaturbo is a done-for-you AI agent agency for Malaysian SMEs, especially KL and Selangor businesses.

## What the live MVP does

- Presents a conversion-focused public site for the new service model
- Captures applications for free AI agent setup
- Stores leads in MongoDB when configured
- Falls back to a local JSON file in development when MongoDB is unavailable
- Keeps the existing portal routes available for the legacy workflow product

## Public pages

- `/` Home
- `/apply` Lead application form
- `/demo` Demo flows
- `/contact` Contact details and CTA

## Lead API

- `POST /api/leads`
- Validates the application payload
- Saves `createdAt`, `status: "new"`, and `source: "website_apply_form"`

## Stack

- Monorepo with npm workspaces
- `apps/web`: Next.js App Router + TypeScript + Tailwind
- `apps/api`: Express + TypeScript + MongoDB Atlas via Mongoose

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment variables

### API: `apps/api/.env`

```bash
PORT=4000
CORS_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/chaturbo_ai_sme
JWT_SECRET=change_me
APP_BASE_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_xxx
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

Notes:

- `MONGODB_URI` is optional for the new public lead flow.
- If `MONGODB_URI` is missing, `POST /api/leads` uses `apps/api/data/leads.json` in development.
- Legacy auth and portal routes still expect the database and JWT secret.

### Web: `apps/web/.env.local`

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
```

## 3. Start the app

Start the API:

```bash
npm run dev:api
```

Start the web app:

```bash
npm run dev:web
```

Open `http://localhost:3000`.

## 4. Optional legacy portal

The older workflow marketplace and owner portal still exist in the repo under routes like:

- `/dashboard`
- `/workflows`
- `/register`
- `/login`

## 5. Build and lint

```bash
npm run build
npm run lint
```

## New business model

Chaturbo now sells AI employee setup and maintenance for SMEs instead of workflow marketplace access.

Core offer:

- Free pilot for the first 10 KL/Selangor SMEs
- Monthly maintenance starting from RM399/month
- Custom builds from RM1,500 setup plus monthly maintenance

## Lead fields collected

- Full name
- Company name
- Phone / WhatsApp number
- Email
- Industry
- Business location
- Website / Facebook / Instagram
- Task to automate
- Customer message sources
- Urgency
- Consent to be contacted
