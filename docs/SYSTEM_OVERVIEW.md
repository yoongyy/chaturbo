# Chaturbo System Overview & Architecture Documentation

Welcome to **Chaturbo.com** (AI Missed Call Lead Rescue SaaS). This document outlines the architecture, technology stack, current workflows, and key modules of the Chaturbo MVP.

---

## 1. System Architecture & Tech Stack

Chaturbo is structured as a TypeScript-based **npm workspaces monorepo** consisting of two main applications and a shared package:

```
chaturbo/
├── apps/
│   ├── web/          # Next.js App Router Frontend
│   └── api/          # Express.js REST API Backend
├── packages/
│   └── cli/          # CLI utility for agent logs & marketplace sync
└── scratch/          # Independent automation & generation scripts
```

### Technology Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS, TypeScript.
- **Backend**: Node.js, Express, MongoDB with Mongoose ORM.
- **AI Engine**: OpenAI Node SDK (currently using `gpt-4o-mini`).
- **Communication**: Twilio SDK for voice forwarding, call status, and SMS conversational lead qualification.
- **Outreach Video Engine**: Headless Chromium (Playwright), Edge TTS (Microsoft Edge Read Aloud engine), and FFmpeg.
- **Transactional Emails**: Resend API.
- **Payments & Billing**: Stripe API.

---

## 2. Main Applications

### A. Frontend (`apps/web`)
The frontend is a modern Next.js client handling administrative, customer-facing, and dashboard routing:
- **Public Routes**:
  - `/` - SaaS landing page showcasing value proposition and founding offer ($299 one-time).
  - `/register` / `/login` - Multi-tenant contractor authentication (configured with Google and Facebook OAuth support).
  - `/pricing` - Starter, Pro, and Growth tiers.
  - `/audit/[slug]` - Public page displaying a generated AI lead-leak audit for a contractor prospect.
- **Protected Dashboard (`/dashboard`)**:
  - `/dashboard/businesses` - Management console to configure contractor profiles, business hours, Twilio numbers, and AI tone.
  - `/dashboard/leads` - List of rescued leads, text logs, and qualification status.
  - `/dashboard/audits/new` - Interface to create new contractor targets, run crawls, and generate cold-outreach templates.

### B. Backend (`apps/api`)
The backend is a stateless Express server connecting lazily to MongoDB. Key route domains include:
- `/auth` - JWT authentication, registration, password hashing.
- `/api/rescue/businesses` - Contractor profile settings, Twilio phone assignments, AI settings.
- `/api/rescue/leads` - Lead ingestion, qualification tracking, message logs.
- `/api/rescue/audits` - Website scraping (`crawlWebsite`), AI audits, converting audit targets to customers.
- `/api/twilio` - Receives Twilio webhooks for voice forwarding (`/voice/incoming`), status updates, and SMS messages (`/sms/incoming`).

---

## 3. Database Schema Overview (MongoDB / Mongoose)

- **`User`**: Account details (email, hashed password, API keys, role).
- **`Business`**: Multi-tenant contractor details (industry, Twilio number, forward-to phone, AI tone, business hours, status, Stripe plan).
- **`AuditTarget`**: Prospects crawled from public directories (business name, rating, reviews, website, crawl status, extracted website text).
- **`Audit`**: Generated marketing assets for a target (problems, recommendations, cold email script, follow-up script, video script, public audit page HTML).
- **`Lead`**: Rescued callers (phone, city, status, urgency, summarized job details).
- **`Message`**: Conversational SMS history between Chaturbo's AI agent and the lead.
- **`PhoneNumber`**: Twilio number provisioning inventory.
- **`Workflow` / `WorkflowDraft`**: Workflows synchronized via CLI/Marketplace.

---

## 4. Existing Automations & Core Pipelines

### Pipeline A: Twilio Missed-Call Lead Rescue Loop
When a prospect dials a contractor's Chaturbo Twilio number:
1. **Call Forwarding**: Twilio routes the call to the contractor's personal phone.
2. **Detection**: If the contractor misses or rejects the call, the Twilio webhook calls `/api/twilio/voice/status`.
3. **Instant SMS Text-Back**: Within 3 seconds, Chaturbo sends an automated text to the homeowner:
   > *"Hey! Sorry we missed your call. We're on a job or driving, but we want to help you. What project can we quote for you today?"*
4. **AI Qualification**: As the homeowner replies, `/api/twilio/sms/incoming` processes the message, triggers `generateSmsReply` (utilizing `gpt-4o-mini`), and asks **one concise question at a time** (capturing service needed, location, urgency, and photos) without overwhelming the user.
5. **Owner Alert**: Once fully qualified, the lead details are summarized using AI (`summarizeLead`) and texted/emailed directly to the contractor.

### Pipeline B: Headless Lead Video Generator (`scratch/vps_lead_video_generator.js`)
An automation script built to run on Windows VPS, Linux, or macOS. It compiles personalized pitch videos targeting contractors who don't have a chat widget on their site:
1. **Targeting**: Loads contractor targets from `analyzed_leads.json`.
2. **Audio Voiceover Generation**: Utilizes Microsoft's `edge-tts` to generate a natural voiceover (`en-US-ChristopherNeural`) reading a custom sales pitch referencing the contractor's specific rating, competitor names, and missing chat widget.
3. **Visual Recording (Playwright)**: Launches a headless Chromium tab that visits:
   - Google Maps (searching the business).
   - The contractor's website (scrolling slowly to highlight the absence of a live chat widget in the bottom corner).
   - A Warning callout popup overlaid dynamically.
   - The competitor's Google Maps listing (highlighting that the competitor has 24/7 live chat).
   - The Chaturbo landing page explaining the text-back solution.
4. **Video Compilation**: Uses `ffmpeg` to merge the Playwright tab video recording with the generated voiceover, compressing it into an email-friendly H264 MP4 file under 10MB.

---
