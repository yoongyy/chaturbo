import Link from "next/link";
import type { ReactNode } from "react";

const painPoints = [
  {
    title: "Replies take too long",
    text: "Potential customers ask on WhatsApp, Facebook, Instagram, or your website and your team cannot respond instantly every time."
  },
  {
    title: "Leads get lost",
    text: "People enquire, then disappear because no one captures the lead properly or follows up at the right time."
  },
  {
    title: "Admin work piles up",
    text: "Staff keep repeating the same tasks: updating sheets, asking for documents, and chasing status updates."
  },
  {
    title: "Quotations are delayed",
    text: "The sales process slows down because information is scattered and the quote cannot be prepared quickly."
  },
  {
    title: "Owners have poor visibility",
    text: "There is no simple daily summary of leads, pending tasks, and unresolved customer requests."
  },
  {
    title: "Automation feels too technical",
    text: "You know the business needs better systems, but most tools are too complex to set up and manage internally."
  }
];

const capabilities = [
  "Reply customer enquiries automatically",
  "Collect qualified leads from chat",
  "Book appointments and capture context",
  "Prepare quotation-ready information",
  "Chase invoices, receipts, and missing files",
  "Update Google Sheets, Airtable, or CRM records",
  "Send follow-up reminders at the right time",
  "Generate daily summary reports for the owner"
];

const demoAgents = [
  {
    title: "AI Admin Agent",
    description: "Handles repetitive admin tasks, updates sheets, and reminds staff.",
    outcome: "Reduces manual follow-up and data entry.",
    accent: "from-[#eefbf6] to-[#dff7eb]"
  },
  {
    title: "AI Sales Agent",
    description: "Answers product and service questions, qualifies leads, and follows up.",
    outcome: "Stops hot leads from going cold.",
    accent: "from-[#fff6e9] to-[#ffe6c5]"
  },
  {
    title: "AI Quotation Agent",
    description: "Collects customer requirements and prepares structured quote requests.",
    outcome: "Speeds up quote preparation.",
    accent: "from-[#edf4ff] to-[#dce8ff]"
  },
  {
    title: "AI Document Chaser",
    description: "Collects invoices, receipts, forms, and missing documents from customers.",
    outcome: "Makes document chasing consistent.",
    accent: "from-[#fff0eb] to-[#ffe1d8]"
  }
];

const industries = [
  "Accounting & bookkeeping firms",
  "Clinics, dental, aesthetic, wellness centres",
  "Renovation, contractor, cleaning, pest control",
  "Tuition and training centres",
  "Property agents and agencies",
  "Car dealers and service businesses"
];

const offerItems = [
  "1 AI workflow setup",
  "AI FAQ trained on business info",
  "Lead capture system",
  "Google Sheet or CRM connection",
  "Basic follow-up automation",
  "14-day support",
  "1-hour consultation and training"
];

const pricing = [
  {
    name: "Starter",
    price: "RM399/month",
    highlight: "Good for one simple customer-facing task.",
    items: ["AI FAQ agent", "Lead capture", "Basic web chat or WhatsApp-ready flow", "Google Sheet update", "Monthly maintenance"]
  },
  {
    name: "Growth",
    price: "RM899/month",
    highlight: "Best for teams that need more follow-up and internal automation.",
    items: [
      "Everything in Starter",
      "Follow-up automation",
      "Quotation and document collection flow",
      "CRM, Airtable, or Google Sheet integration",
      "Monthly improvement session"
    ]
  },
  {
    name: "Custom",
    price: "From RM1,500 setup + monthly maintenance",
    highlight: "For multi-step operations with internal handoffs and custom automations.",
    items: ["Custom AI agent workflow", "n8n or Zapier automation", "Browser or task automation where possible", "Multi-agent workflow", "Staff training"]
  }
];

const processSteps = [
  {
    step: "01",
    title: "Free consultation",
    text: "We review the customer flow, bottleneck, and which repetitive task should be solved first."
  },
  {
    step: "02",
    title: "Choose one repetitive task",
    text: "We start with the highest-value task that will save time or recover lost leads quickly."
  },
  {
    step: "03",
    title: "Build your AI agent pilot",
    text: "We wire up the chatbot, follow-up logic, and the sheet or CRM connection."
  },
  {
    step: "04",
    title: "Train staff and improve monthly",
    text: "The team learns the new workflow, and we keep refining the system as the business grows."
  }
];

const faqs = [
  {
    question: "Is this only a WhatsApp chatbot?",
    answer:
      "No. WhatsApp is one channel, but the real offer is a business workflow system. We can build web chat, lead capture, quotation flows, document chasing, spreadsheet updates, and internal automation around your process."
  },
  {
    question: "Can you customise based on my business workflow?",
    answer:
      "Yes. We start from how your team works today, then automate the most repetitive step first. The setup is tailored to your industry, customer journey, and internal process."
  },
  {
    question: "Do I need technical knowledge?",
    answer:
      "No. We handle the setup, explain the workflow in plain language, and train your team so they can use it without becoming technical."
  },
  {
    question: "What happens after the free setup?",
    answer:
      "After the pilot, you can continue with monthly maintenance starting from RM399/month. We review what worked, improve the flow, and expand the automation if you want."
  },
  {
    question: "Can this connect to Google Sheets, CRM, n8n, or Zapier?",
    answer:
      "Yes. We can connect to Google Sheets, Airtable, CRM tools, and workflow automation tools like n8n or Zapier where appropriate."
  },
  {
    question: "Do you provide training and maintenance?",
    answer:
      "Yes. Training is included in the pilot, and ongoing maintenance is available if you want us to keep refining and supporting the system."
  }
];

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.24em] text-mint">{children}</p>;
}

function CtaButton({ children }: { children: ReactNode }) {
  return (
    <Link href="/apply" className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-ink/15">
      {children}
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
      <section className="relative overflow-hidden rounded-[36px] bg-[#0c1420] px-6 py-8 text-white shadow-[0_30px_90px_rgba(8,16,26,0.38)] md:px-10 md:py-10">
        <div className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-[#1d7a6b]/25 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[#e96a41]/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#b7dcca]">
              Limited free pilot for first 10 KL/Selangor SMEs
            </div>
            <h1 className="font-display mt-5 max-w-3xl text-4xl leading-[0.96] md:text-6xl">
              AI Employees for Malaysian SME owners who want faster replies and less admin
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              We build and run custom AI agents that reply customers, capture leads, prepare quotations, chase documents, update spreadsheets, and automate repetitive admin work so your business can move faster every day.
            </p>
            <p className="mt-4 max-w-2xl text-sm text-slate-400">
              You do not need to be technical. We design the workflow, connect the tools, and train your team.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <CtaButton>Apply Free Setup</CtaButton>
              <CtaButton>Get Free AI Automation Audit</CtaButton>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Pilot</p>
                <p className="mt-2 text-lg font-semibold">One workflow, built fast</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Stack</p>
                <p className="mt-2 text-lg font-semibold">WhatsApp, web chat, sheets, CRM</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Best fit</p>
                <p className="mt-2 text-lg font-semibold">KL / Selangor SMEs</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <SectionLabel>What you get</SectionLabel>
              <div className="mt-4 grid gap-3">
                {offerItems.slice(0, 4).map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/10 px-4 py-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#9ae6c9]" />
                    <p className="text-sm text-slate-100">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Built for speed</p>
              <p className="mt-2 text-3xl font-semibold">RM399/month from the pilot</p>
              <p className="mt-2 text-sm text-slate-300">Start small, prove value, then expand only when the workflow earns it.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-black/5 bg-white/90 p-6 shadow-[0_18px_50px_rgba(18,46,54,0.08)] md:p-8">
        <SectionLabel>Lead magnet</SectionLabel>
        <div className="mt-2 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">Free AI Automation Audit for Your Business</h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              We look at your customer journey, reply flow, and admin process, then show you where an AI agent can save time or recover missed leads fastest.
            </p>
            <div className="mt-5 grid gap-3 text-sm text-slate-700">
              <p className="rounded-2xl bg-sand/60 px-4 py-3">Identify the most repetitive task in your business</p>
              <p className="rounded-2xl bg-sand/60 px-4 py-3">Spot the fastest automation opportunity</p>
              <p className="rounded-2xl bg-sand/60 px-4 py-3">Recommend the right setup for your workflow and tools</p>
            </div>
          </div>
          <div className="rounded-[28px] bg-[#0f1720] p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9ae6c9]">Audit includes</p>
            <div className="mt-4 grid gap-3">
              {[
                "A short review of your current process",
                "A practical pilot idea",
                "Suggested tools and integrations",
                "A next-step plan your team can understand"
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-slate-100">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-5">
              <CtaButton>Apply Free Setup</CtaButton>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-black/5 bg-white/90 p-6 shadow-[0_18px_50px_rgba(18,46,54,0.08)] md:p-8">
        <SectionLabel>Problem</SectionLabel>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">Why SMEs need this now</h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Most teams do not need a huge transformation on day one. They need one reliable AI employee that removes friction from a single repetitive workflow.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {painPoints.map((point) => (
            <div key={point.title} className="rounded-3xl border border-black/5 bg-sand/55 p-5">
              <p className="text-lg font-semibold text-ink">{point.title}</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{point.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-black/5 bg-[#0f1720] p-6 text-white shadow-[0_18px_50px_rgba(15,23,32,0.25)] md:p-8">
        <SectionLabel>Solution</SectionLabel>
        <h2 className="font-display mt-2 text-3xl font-semibold md:text-4xl">Chaturbo builds AI agents that do real work</h2>
        <p className="mt-3 max-w-3xl text-slate-300">
          Each setup is tailored to the business and designed to support staff, not replace them blindly.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {capabilities.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#9ae6c9]" />
              <p className="text-sm text-slate-100">{item}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-slate-300">
          Built by a Malaysia-based software developer with experience in AI automation, web systems, CRM, Shopify, WhatsApp bots, and business workflow automation.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[32px] border border-black/5 bg-white/90 p-6 shadow-[0_18px_50px_rgba(18,46,54,0.08)] md:p-8">
          <SectionLabel>Demo agents</SectionLabel>
          <h2 className="font-display mt-2 text-3xl font-semibold text-ink md:text-4xl">What the AI employee can look like</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {demoAgents.map((agent) => (
              <div key={agent.title} className={`rounded-3xl border border-black/5 bg-gradient-to-br ${agent.accent} p-5`}>
                <p className="text-lg font-semibold text-ink">{agent.title}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{agent.description}</p>
                <p className="mt-4 text-sm font-semibold text-ink">{agent.outcome}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-black/5 bg-white/90 p-6 shadow-[0_18px_50px_rgba(18,46,54,0.08)] md:p-8">
          <SectionLabel>Industries</SectionLabel>
          <h2 className="font-display mt-2 text-3xl font-semibold text-ink md:text-4xl">Built for businesses that live in chat</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {industries.map((industry) => (
              <div key={industry} className="rounded-3xl border border-black/5 bg-sand/55 p-5">
                <p className="text-base font-semibold text-ink">{industry}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[32px] border border-black/5 bg-[#fffaf6] p-6 shadow-[0_18px_50px_rgba(18,46,54,0.08)] md:p-8">
          <SectionLabel>Offer</SectionLabel>
          <h2 className="font-display mt-2 text-3xl font-semibold text-ink md:text-4xl">Free AI Agent Setup for First 10 SMEs</h2>
          <p className="mt-3 text-slate-600">
            This pilot is designed to show value fast. You get one working setup and a practical workflow your team can actually use.
          </p>
          <div className="mt-6 grid gap-3">
            {offerItems.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-coral" />
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm font-semibold text-ink">After the free pilot, continue from RM399/month maintenance. No obligation.</p>
          <div className="mt-5">
            <CtaButton>Apply Free Setup</CtaButton>
          </div>
        </div>

        <div className="rounded-[32px] border border-black/5 bg-[#0f1720] p-6 text-white shadow-[0_18px_50px_rgba(15,23,32,0.25)] md:p-8">
          <SectionLabel>Why this works</SectionLabel>
          <h2 className="font-display mt-2 text-3xl font-semibold md:text-4xl">The pilot is small, measurable, and easy to expand</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {["Faster response time", "Better lead capture", "Less manual follow-up", "A clearer owner view"].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Outcome</p>
                <p className="mt-2 text-lg font-semibold">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-5">
            <p className="text-sm text-slate-300">
              We make the first automation easy to understand, easy to test, and easy to expand after the pilot.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-black/5 bg-white/90 p-6 shadow-[0_18px_50px_rgba(18,46,54,0.08)] md:p-8">
        <SectionLabel>Pricing</SectionLabel>
        <h2 className="font-display mt-2 text-3xl font-semibold text-ink md:text-4xl">Simple monthly options after the free pilot</h2>
        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {pricing.map((plan, index) => (
            <div
              key={plan.name}
              className={`rounded-[28px] border p-6 shadow-[0_14px_40px_rgba(18,46,54,0.08)] ${
                index === 1 ? "border-ink bg-[#0f1720] text-white" : "border-black/5 bg-sand/55 text-ink"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{plan.name}</p>
              <p className={`mt-3 text-3xl font-semibold ${index === 1 ? "text-white" : "text-ink"}`}>{plan.price}</p>
              <p className={`mt-3 text-sm leading-7 ${index === 1 ? "text-slate-300" : "text-slate-600"}`}>{plan.highlight}</p>
              <div className="mt-5 grid gap-3">
                {plan.items.map((item) => (
                  <div key={item} className={`rounded-2xl px-4 py-3 ${index === 1 ? "bg-white/10 text-slate-100" : "bg-white/80 text-slate-700"}`}>
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <CtaButton>Apply Free Setup</CtaButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-black/5 bg-[#0f1720] p-6 text-white shadow-[0_18px_50px_rgba(15,23,32,0.25)] md:p-8">
        <SectionLabel>Process</SectionLabel>
        <h2 className="font-display mt-2 text-3xl font-semibold md:text-4xl">Four steps from idea to live pilot</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          {processSteps.map((item) => (
            <div key={item.step} className="rounded-[28px] border border-white/10 bg-white/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9ae6c9]">{item.step}</p>
              <p className="mt-3 text-lg font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-black/5 bg-white/90 p-6 shadow-[0_18px_50px_rgba(18,46,54,0.08)] md:p-8">
        <SectionLabel>FAQ</SectionLabel>
        <h2 className="font-display mt-2 text-3xl font-semibold text-ink md:text-4xl">Common questions before the free setup</h2>
        <div className="mt-6 grid gap-4">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-[28px] border border-black/5 bg-sand/55 p-5">
              <summary className="cursor-pointer list-none text-lg font-semibold text-ink">{faq.question}</summary>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-black/5 bg-[#0f1720] p-6 text-white shadow-[0_18px_50px_rgba(15,23,32,0.25)] md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>CTA</SectionLabel>
            <h2 className="font-display mt-2 text-3xl font-semibold md:text-4xl">If one repetitive task is slowing your business down, start with that</h2>
            <p className="mt-2 max-w-2xl text-slate-300">
              Apply for the free setup and we will help you turn one high-friction workflow into a practical AI employee.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CtaButton>Apply Free Setup</CtaButton>
          </div>
        </div>
      </section>
    </main>
  );
}
