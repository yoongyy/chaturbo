import Link from "next/link";

const demos = [
  {
    title: "Clinic AI Front Desk",
    intro: "Customer asks about a treatment, the AI replies with a price range, asks for preferred date and time, and captures the lead.",
    conversation: [
      { role: "Customer", text: "Hi, how much is dental scaling?" },
      { role: "AI", text: "Thanks for asking. Our dental scaling starts from RM120 to RM180 depending on the condition. What date and time do you prefer?" },
      { role: "Customer", text: "This Saturday morning." },
      { role: "AI", text: "Great. Please share your name and phone number so we can confirm the slot." }
    ],
    captured: ["Treatment interest", "Preferred date and time", "Name and phone number"],
    automation: "Creates a lead, updates the sheet, and alerts the staff."
  },
  {
    title: "Accounting Document Chaser",
    intro: "The AI reminds clients to submit receipts, invoices, and bank statements, then updates the tracking sheet when items arrive.",
    conversation: [
      { role: "AI", text: "Hi, we still need your receipts, invoices, and bank statement for this month." },
      { role: "Client", text: "I will send them later today." },
      { role: "AI", text: "Thanks. Once received, I will mark the item as complete and notify the team." }
    ],
    captured: ["Missing documents", "Submission status", "Client reminder history"],
    automation: "Updates the tracking sheet and schedules a follow-up reminder."
  },
  {
    title: "Renovation Quotation Assistant",
    intro: "The AI gathers the right project details before a staff member prepares the quote.",
    conversation: [
      { role: "AI", text: "What type of property do you want to renovate?" },
      { role: "Customer", text: "A condo in Petaling Jaya." },
      { role: "AI", text: "What is your budget, target date, and do you have photos we can review?" },
      { role: "Customer", text: "Budget is RM35k and I can share photos now." }
    ],
    captured: ["Property type", "Location", "Budget", "Photos", "Preferred renovation date"],
    automation: "Prepares a structured quote request for the sales team."
  }
];

export default function DemoPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <section className="rounded-[32px] border border-black/5 bg-white/90 p-6 shadow-[0_18px_50px_rgba(18,46,54,0.08)] md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-mint">Demo</p>
        <h1 className="font-display mt-3 text-4xl font-semibold text-ink md:text-5xl">See the AI agent flows in action</h1>
        <p className="mt-4 max-w-3xl text-slate-600">
          These demos show how Chaturbo handles conversations, captures data, and routes the result into the next step of the workflow.
        </p>
      </section>

      <div className="mt-6 grid gap-5">
        {demos.map((demo) => (
          <section key={demo.title} className="rounded-[32px] border border-black/5 bg-white/90 p-6 shadow-[0_18px_50px_rgba(18,46,54,0.08)] md:p-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Demo flow</p>
                <h2 className="font-display mt-2 text-3xl font-semibold text-ink">{demo.title}</h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-slate-600">{demo.intro}</p>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="rounded-[28px] bg-[#0f1720] p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9ae6c9]">Conversation</p>
                <div className="mt-4 grid gap-3">
                  {demo.conversation.map((message) => (
                    <div
                      key={`${demo.title}-${message.role}-${message.text}`}
                      className={`max-w-[92%] rounded-3xl px-4 py-3 text-sm leading-7 ${
                        message.role === "AI" ? "ml-0 bg-white/10 text-slate-100" : "ml-auto bg-[#1d7a6b] text-white"
                      }`}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70">{message.role}</p>
                      <p className="mt-1">{message.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[28px] border border-black/5 bg-[#eef9f5] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-mint">Captured data</p>
                  <div className="mt-4 grid gap-3">
                    {demo.captured.map((item) => (
                      <div key={item} className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[28px] border border-black/5 bg-[#fff6ef] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">Automation next</p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{demo.automation}</p>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="mt-6 rounded-[32px] border border-black/5 bg-[#0f1720] p-6 text-white shadow-[0_18px_50px_rgba(15,23,32,0.25)] md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9ae6c9]">Next step</p>
            <h2 className="font-display mt-2 text-3xl font-semibold md:text-4xl">Want us to build one of these for your business?</h2>
            <p className="mt-2 max-w-2xl text-slate-300">
              Start with one high-value workflow and turn it into your first live AI employee.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/apply" className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-ink">
              Apply for Free Setup
            </Link>
            <Link href="/apply" className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white">
              Start Free Audit
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
