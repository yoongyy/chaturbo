"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type TradeId = "roofing" | "hvac" | "plumbing" | "electrical";

type TradeScenario = {
  id: TradeId;
  name: string;
  icon: string;
  heroHeadline: string;
  subheadline: string;
  businessName: string;
  senderName: string;
  homeownerInitialMsg: string;
  aiResponse1: string;
  homeownerReplyMsg: string;
  aiResponse2: string;
  jobValue: number;
};

const TRADE_SCENARIOS: Record<TradeId, TradeScenario> = {
  roofing: {
    id: "roofing",
    name: "Roofing",
    icon: "🏠",
    heroHeadline: "Stop letting missed roofing calls go to your competitors.",
    subheadline:
      "When a homeowner calls about a leak, hail damage, or a replacement estimate, Chaturbo texts them back in 3 seconds, qualifies the job, and locks the lead into your calendar before they click the next roofer.",
    businessName: "Apex Roofing",
    senderName: "Mike",
    homeownerInitialMsg: "Hey, looking for an emergency roofing quote in Dallas. Tree branch hit my garage roof.",
    aiResponse1:
      "Hey, this is Mike from Apex Roofing. Sorry I missed you, I’m stuck up on a roof! Are you looking for an emergency tarping quote or a full inspection?",
    homeownerReplyMsg: "Full inspection and estimate for insurance.",
    aiResponse2: "Got it. Let’s lock that in. Click here to pick a time for an on-site inspection today: [Calendar Link]",
    jobValue: 8500
  },
  hvac: {
    id: "hvac",
    name: "HVAC",
    icon: "❄️",
    heroHeadline: "Stop letting missed AC repair calls go to your competitors.",
    subheadline:
      "In peak summer and winter, an unanswered HVAC call is a lost emergency. Chaturbo texts back in 3 seconds, qualifies the issue, and books the next available visit before the homeowner calls the next shop.",
    businessName: "Comfort Air HVAC",
    senderName: "Steve",
    homeownerInitialMsg: "My AC just blew out and it is 100 degrees inside. Can you send someone?",
    aiResponse1:
      "Hey, this is Steve from Comfort Air. Sorry I missed your call, we’re out on emergency repairs! Is your AC completely dead, or is it just blowing warm air?",
    homeownerReplyMsg: "Completely dead. Fan is not spinning at all.",
    aiResponse2: "Understood, we’ll prioritize this. Click here to instantly book our next available emergency slot: [Calendar Link]",
    jobValue: 4500
  },
  plumbing: {
    id: "plumbing",
    name: "Plumbing",
    icon: "💧",
    heroHeadline: "Stop letting missed plumbing calls go to your competitors.",
    subheadline:
      "A burst pipe or clogged drain does not wait. Chaturbo sends an instant text-back, identifies the urgency, and secures the booking before water damage gets worse.",
    businessName: "ProFlow Plumbing",
    senderName: "Dave",
    homeownerInitialMsg: "Urgent: I have a burst water pipe in my garage. Water is starting to pool.",
    aiResponse1:
      "Hey, this is Dave from ProFlow Plumbing. Sorry I missed you, I’m in a crawlspace! Do you know where your main water shutoff valve is located?",
    homeownerReplyMsg: "Yes, found it and shut it off. Need a plumber to replace the split pipe.",
    aiResponse2: "Perfect, that saves major damage. Let’s get a tech dispatched to repair it. Secure your slot here: [Calendar Link]",
    jobValue: 1200
  },
  electrical: {
    id: "electrical",
    name: "Electrical",
    icon: "⚡",
    heroHeadline: "Stop letting missed electrical calls go to your competitors.",
    subheadline:
      "Hot panels, dead outlets, and EV charger installs need fast replies. Chaturbo texts homeowners back in 3 seconds flat, confirms the issue, and secures the visit while the lead is still warm.",
    businessName: "Sparky Electric",
    senderName: "Gary",
    homeownerInitialMsg: "Looking to get an EV charger installed in my garage, and my panel might need upgrading.",
    aiResponse1:
      "Hey, this is Gary from Sparky Electric. Sorry I missed you, I’m wrapping up a commercial rewiring! Do you know if your current panel is 100-amp or 200-amp?",
    homeownerReplyMsg: "I think it is 100-amp. It’s pretty old.",
    aiResponse2: "Got it, an upgrade is likely needed. Let’s set up an on-site consultation. Book a quick 10-minute slot here: [Calendar Link]",
    jobValue: 3200
  }
};

const topMetrics = [
  { value: "3s", label: "Response time" },
  { value: "85%+", label: "Lead rescue rate" },
  { value: "24/7", label: "Digital dispatcher" }
];

const painCards = [
  {
    title: "A missed call is leaked revenue",
    text: "When you’re up on a roof, in traffic, or finishing a job, you cannot answer every ring. Homeowners do not wait."
  },
  {
    title: "The next contractor wins by speed",
    text: "People calling for a repair or an estimate have zero patience. If you do not answer immediately, they call the next company."
  },
  {
    title: "Your marketing budget needs a rescue layer",
    text: "If you are paying for ads and SEO but missing calls, you are leaking cash at the exact moment intent is highest."
  }
];

const featureCards = [
  {
    title: "The 24/7 Instant Text-Back",
    text: "The moment a call is missed, the system texts the homeowner so they know somebody is responding."
  },
  {
    title: "The Live SMS Dispatcher",
    text: "One question at a time: what job, where, and how urgent. Then the lead is qualified without admin overhead."
  },
  {
    title: "The Owner Summary",
    text: "Every lead lands as a clean summary with the job, city, urgency, and next step. Nothing feels like software training."
  }
];

const offerPoints = [
  "$997 one-time setup to configure tracking lines, call forwarding, and the booking flow.",
  "$299/month maintenance to keep routing, texting, and workflow tuning running.",
  "If the system does not save and book at least 3 high-ticket jobs in your first 30 days, the setup fee is refunded."
];

const faqs = [
  {
    q: "Do I need to learn a dashboard?",
    a: "No. The owner only needs a simple lead inbox. The technical setup stays behind the scenes."
  },
  {
    q: "Is this for contractors only?",
    a: "Yes. The page is written for roofers, HVAC, plumbing, electrical, and similar local service businesses."
  },
  {
    q: "What happens after a missed call?",
    a: "The system texts the lead back, qualifies the request, and pushes a clean summary to the owner."
  }
];

const integrationTags = ["Housecall Pro", "Jobber", "Calendly", "ServiceTitan", "Google Calendar"];

const defaultAuditForm = {
  companyName: "",
  ownerName: "",
  trade: "Roofing",
  phone: "",
  website: ""
};

export default function HomePage() {
  const [selectedTrade, setSelectedTrade] = useState<TradeId>("roofing");
  const scenario = TRADE_SCENARIOS[selectedTrade];

  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string; time: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatReplayKey, setChatReplayKey] = useState(0);

  const [missedCalls, setMissedCalls] = useState(12);
  const [avgJobValue, setAvgJobValue] = useState(scenario.jobValue);
  const [conversionRate, setConversionRate] = useState(35);

  const [auditStep, setAuditStep] = useState<"idle" | "scanning" | "success">("idle");
  const [auditProgress, setAuditProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState("");
  const [formData, setFormData] = useState(defaultAuditForm);

  useEffect(() => {
    setAvgJobValue(scenario.jobValue);
  }, [scenario.jobValue, selectedTrade]);

  useEffect(() => {
    setMessages([]);
    setIsTyping(false);

    const timeline = [
      window.setTimeout(() => {
        setMessages([{ sender: "user", text: scenario.homeownerInitialMsg, time: "9:41 AM" }]);
      }, 900),
      window.setTimeout(() => {
        setIsTyping(true);
      }, 2100),
      window.setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { sender: "ai", text: scenario.aiResponse1, time: "9:41 AM" }]);
      }, 4400),
      window.setTimeout(() => {
        setMessages((prev) => [...prev, { sender: "user", text: scenario.homeownerReplyMsg, time: "9:42 AM" }]);
      }, 7600),
      window.setTimeout(() => {
        setIsTyping(true);
      }, 9100),
      window.setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { sender: "ai", text: scenario.aiResponse2, time: "9:42 AM" }]);
      }, 11300)
    ];

    return () => timeline.forEach((timer) => window.clearTimeout(timer));
  }, [scenario, chatReplayKey]);

  useEffect(() => {
    if (auditStep !== "scanning") return;

    const steps = [
      { progress: 18, msg: "Connecting to business metadata..." },
      { progress: 35, msg: "Analyzing local Google Business profile speed..." },
      { progress: 55, msg: "Measuring missed-call revenue leak..." },
      { progress: 76, msg: "Mapping booking and response bottlenecks..." },
      { progress: 100, msg: "Generating the private audit recap..." }
    ];

    const timers = steps.map((step, index) =>
      window.setTimeout(() => {
        setAuditProgress(step.progress);
        setScanMessage(step.msg);
        if (step.progress === 100) {
          window.setTimeout(() => setAuditStep("success"), 750);
        }
      }, (index + 1) * 900)
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [auditStep]);

  const monthlyLeakedRevMax = missedCalls * avgJobValue;
  const monthlyLeakedRevMin = Math.round(missedCalls * 0.62) * avgJobValue;
  const savedJobs = Math.ceil(missedCalls * (conversionRate / 100));
  const recoveredRevenue = savedJobs * avgJobValue;
  const netProfitWithChaturbo = recoveredRevenue - 299;

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleAuditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuditStep("scanning");
    setAuditProgress(0);
    setScanMessage("Starting audit...");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-orange-500/30 selection:text-orange-300">
      <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-orange-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute right-1/4 top-[1200px] h-[600px] w-[600px] rounded-full bg-blue-600/5 blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[800px] left-10 h-[400px] w-[400px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />

      <nav className="fixed top-0 z-50 w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 p-2 shadow-[0_0_15px_rgba(249,115,22,0.4)]">
              <span className="block text-sm font-black text-slate-950">CR</span>
            </div>
            <div className="leading-tight">
              <p className="flex items-center gap-2 text-xl font-black uppercase tracking-tighter text-white">
                Chaturbo
                <span className="rounded-md border border-orange-500/20 bg-orange-500/10 px-1.5 py-0.5 text-[9px] uppercase tracking-normal text-orange-400">
                  AI
                </span>
              </p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Lead Rescue Engine</p>
            </div>
          </Link>

          <div className="hidden items-center gap-10 text-sm font-semibold tracking-wide text-slate-300 md:flex">
            <button onClick={() => scrollToSection("features")} className="transition-colors hover:text-orange-500">
              Features
            </button>
            <button onClick={() => scrollToSection("roi")} className="transition-colors hover:text-orange-500">
              ROI & Calculator
            </button>
            <button onClick={() => scrollToSection("pricing")} className="transition-colors hover:text-orange-500">
              Pricing
            </button>
            <button onClick={() => scrollToSection("faq")} className="transition-colors hover:text-orange-500">
              FAQ
            </button>
            <button
              onClick={() => scrollToSection("audit-form")}
              className="group flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-6 py-2.5 font-bold text-white shadow-md transition-all hover:border-orange-500/50 hover:bg-slate-900 active:scale-95"
            >
              <span>Get Free Audit</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => scrollToSection("audit-form")}
              className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-slate-950"
            >
              Get Audit
            </button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-44 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col items-center text-center">
            <span className="mb-3.5 text-xs font-mono uppercase tracking-widest text-slate-500">
              Customize page for your specific trade
            </span>
            <div className="flex max-w-lg flex-wrap justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-1 shadow-xl">
              {Object.values(TRADE_SCENARIOS).map((trade) => {
                const active = trade.id === selectedTrade;
                return (
                  <button
                    key={trade.id}
                    onClick={() => setSelectedTrade(trade.id)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                      active
                        ? "scale-105 bg-orange-500 text-slate-950 shadow-[0_0_12px_rgba(249,115,22,0.4)]"
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                    }`}
                  >
                    <span>{trade.icon}</span>
                    <span>{trade.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-500">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
                </span>
                <span>Instant {scenario.name} Dispatch</span>
              </div>

              <h1 className="mb-6 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {scenario.heroHeadline}
              </h1>

              <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                {scenario.subheadline}
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  onClick={() => scrollToSection("audit-form")}
                  className="group flex items-center justify-center gap-3 rounded-xl bg-orange-500 px-8 py-4.5 text-sm font-bold text-slate-950 shadow-[0_0_25px_rgba(249,115,22,0.35)] transition-all hover:bg-orange-600 hover:shadow-[0_0_35px_rgba(249,115,22,0.5)] active:scale-95 sm:text-base"
                >
                  <span>GET MY FREE REVENUE AUDIT</span>
                  <span className="transition-transform group-hover:translate-x-1.5">→</span>
                </button>
                <button
                  onClick={() => scrollToSection("roi")}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/30 px-7 py-4.5 text-sm font-semibold text-slate-300 transition-all hover:border-slate-700 hover:bg-slate-900/80 hover:text-white active:scale-95"
                >
                  <span className="text-orange-500">↗</span>
                  <span>See ROI Math</span>
                </button>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-slate-900/80 pt-10">
                {topMetrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="text-2xl font-black text-white sm:text-3xl">{metric.value}</div>
                    <div className="mt-1 text-xs uppercase text-slate-400">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative lg:col-span-5 flex justify-center">
              <div className="absolute inset-0 rounded-full bg-orange-500/10 blur-[130px]" />

              <div className="relative w-full max-w-[340px] rounded-[3.2rem] border-[9px] border-slate-800 bg-slate-900 p-3.5 shadow-2xl ring-1 ring-slate-800/80">
                <div className="flex h-[590px] flex-col overflow-hidden rounded-[2.5rem] bg-slate-950">
                  <div className="absolute left-1/2 top-2 z-20 flex h-5 w-28 -translate-x-1/2 items-center justify-center rounded-full bg-slate-900">
                    <div className="mr-2 h-1 w-12 rounded-full bg-slate-950" />
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-950" />
                  </div>

                  <div className="flex h-12 items-center justify-between px-6 pt-4 text-xs font-mono text-slate-400">
                    <span>9:41 AM</span>
                    <div className="flex items-center gap-2">
                      <span>5G</span>
                      <div className="flex h-2.5 w-5 items-center rounded-sm border border-slate-400 p-0.5">
                        <div className="h-full w-full rounded-2xs bg-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-b border-slate-850 bg-slate-900/90 px-4 py-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-500/20 bg-orange-500/10 text-sm font-bold text-orange-500">
                      {scenario.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-bold text-white">{scenario.businessName} AI</div>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>Active Line Rescue</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setMessages([]);
                        setIsTyping(false);
                        setChatReplayKey((value) => value + 1);
                      }}
                      className="flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1.5 text-[10px] font-bold text-slate-300"
                    >
                      <span>Restart</span>
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col justify-end space-y-4 overflow-y-auto p-4 pt-6 text-sm">
                    {messages.map((message, index) => (
                      <div key={`${message.sender}-${index}`} className={`flex flex-col ${message.sender === "user" ? "items-end" : "items-start"}`}>
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                            message.sender === "user"
                              ? "rounded-tr-none bg-blue-600 text-white"
                              : "rounded-tl-none border border-slate-800 bg-slate-850 text-slate-100"
                          }`}
                        >
                          <p className="text-xs leading-snug sm:text-xs">
                            {message.text.includes("[Calendar Link]") ? (
                              <span>
                                {message.text.replace("[Calendar Link]", "")}
                                <span className="inline-block font-bold text-orange-400 underline">
                                  {scenario.businessName.toLowerCase().replace(" ", "")}.book/estimate
                                </span>
                              </span>
                            ) : (
                              message.text
                            )}
                          </p>
                        </div>
                        <span className="mt-1 px-1 text-[9px] uppercase tracking-wide text-slate-500 font-mono">
                          {message.sender === "user" ? "Homeowner" : `${scenario.businessName} AI`} • {message.time}
                        </span>
                      </div>
                    ))}

                    {isTyping ? (
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-none border border-slate-800 bg-slate-850 px-4 py-3.5 text-slate-300">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-orange-500" style={{ animationDelay: "0ms" }} />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-orange-500" style={{ animationDelay: "150ms" }} />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-orange-500" style={{ animationDelay: "300ms" }} />
                        </div>
                        <span className="mt-1 pl-1 text-[8px] uppercase tracking-wider text-slate-500">
                          Chaturbo AI is responding (3s)...
                        </span>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex h-16 items-center gap-2 border-t border-slate-850 bg-slate-900 p-3">
                    <div className="flex h-10 flex-1 items-center rounded-full border border-slate-800 bg-slate-950 px-4 text-xs text-slate-500">
                      iMessage to {scenario.businessName} AI
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      ↑
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 flex max-w-[200px] items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 shadow-2xl backdrop-blur-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20">
                  <span className="text-orange-500">☎</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Missed Call Detected</div>
                  <div className="text-[9px] font-mono text-slate-400">Chaturbo triggers...</div>
                </div>
              </div>

              <div className="absolute top-1/4 -right-10 flex max-w-[200px] items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 shadow-2xl backdrop-blur-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
                  <span className="text-emerald-500">✓</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Job Secured!</div>
                  <div className="text-[9px] font-mono text-slate-400">Booked on direct link</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-900 bg-slate-900/40 py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 font-mono">
            <span>⚠</span>
            <span>The Leaky Bucket Problem</span>
          </div>

          <h2 className="mx-auto mb-8 max-w-3xl text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
            You are paying for marketing, but your voicemail is leaking cash.
          </h2>

          <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-slate-300 md:text-xl">
            <p>
              Whether you are up on a roof, driving between job sites, or sleeping after a long shift, you cannot pick up every single call. But a missed call is a dead lead.
            </p>
            <p className="text-slate-400">
              Homeowners calling for emergency repairs, AC failures, or high-ticket estimates have zero patience. If you do not answer immediately, they hang up and hand the job to your fastest competitor.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-3xl gap-6 text-left md:grid-cols-3">
            <div className="rounded-xl border border-slate-850 bg-slate-950/80 p-5">
              <div className="mb-1 text-lg font-black text-red-500 font-mono">62%</div>
              <div className="mb-1 text-xs font-bold text-slate-300">Missed Call Average</div>
              <p className="text-xs text-slate-400">Of inbound contractor prospects go straight to voicemail according to industry stats.</p>
            </div>
            <div className="rounded-xl border border-slate-850 bg-slate-950/80 p-5">
              <div className="mb-1 text-lg font-black text-red-500 font-mono">90 Seconds</div>
              <div className="mb-1 text-xs font-bold text-slate-300">Patience Threshold</div>
              <p className="text-xs text-slate-400">Before a frustrated prospect clicks the next local trade listing on their search page.</p>
            </div>
            <div className="rounded-xl border border-slate-850 bg-slate-950/80 p-5">
              <div className="mb-1 text-lg font-black text-orange-500 font-mono">$4,000+</div>
              <div className="mb-1 text-xs font-bold text-slate-300">Leaked Per Week</div>
              <p className="text-xs text-slate-400">In squandered, high-intent leads that went to competitors who picked up first.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <span className="mb-3.5 block text-xs font-mono font-bold uppercase tracking-widest text-orange-500">
              Automated Operations
            </span>
            <h2 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
              Turn your missed calls into booked jobs on autopilot.
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-slate-400 sm:text-base">
              Chaturbo acts as your 24/7 digital dispatcher. It plugs into your existing line and goes to work the exact millisecond you miss a call.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {featureCards.map((card) => (
              <div
                key={card.title}
                className="group flex flex-col rounded-2xl border border-slate-850 bg-slate-900 p-8 transition-all duration-300 hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.05)]"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-500 transition-transform group-hover:scale-110">
                  <span className="text-lg font-black">●</span>
                </div>
                <h3 className="mb-3 text-xl font-black text-white">{card.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-slate-400">{card.text}</p>
                <div className="mt-auto flex items-center gap-1.5 text-xs font-bold text-orange-400 transition-transform group-hover:translate-x-1.5">
                  <span>Speed matters</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-slate-900 bg-slate-900/50 p-6 text-center">
            <span className="mr-4 text-xs uppercase tracking-widest text-slate-500 font-mono">Works seamlessly with:</span>
            <div className="mt-2 inline-flex flex-wrap justify-center gap-x-6 gap-y-2 sm:mt-0">
              {integrationTags.map((tag, index) => (
                <span key={tag} className="text-sm font-semibold text-slate-400 transition-colors hover:text-slate-300">
                  {tag}
                  {index !== integrationTags.length - 1 ? <span className="ml-6 text-slate-700 select-none">•</span> : null}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="roi" className="border-t border-slate-900 bg-slate-900/20 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <span className="mb-3.5 block text-xs font-mono font-bold uppercase tracking-widest text-orange-500">
              Leaked Cash Simulator
            </span>
            <h2 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
              The Cost of Waiting vs. The Speed of Chaturbo
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-slate-400">
              Calculate monthly leaked revenue and see how fast Chaturbo turns missed opportunities into booked jobs.
            </p>
          </div>

          <div className="mb-16 grid items-stretch gap-10 lg:grid-cols-12">
            <div className="rounded-3xl border border-slate-850 bg-slate-900 p-6 shadow-xl lg:col-span-6 sm:p-8">
              <div className="mb-6 flex items-center gap-2">
                <span className="text-orange-500">≡</span>
                <h3 className="text-lg font-black text-white">Adjust Your Business Numbers</h3>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-300">Missed Calls Per Month</span>
                    <span className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1 font-mono text-lg font-black text-white">
                      {missedCalls} calls
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="100"
                    value={missedCalls}
                    onChange={(e) => setMissedCalls(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer rounded-lg bg-slate-950 accent-orange-500"
                  />
                  <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-500">
                    <span>2 Calls</span>
                    <span>50 Calls</span>
                    <span>100 Calls</span>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-300">Average Contract Value ($)</span>
                    <span className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1 font-mono text-lg font-black text-white">
                      ${avgJobValue.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="15000"
                    step="100"
                    value={avgJobValue}
                    onChange={(e) => setAvgJobValue(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer rounded-lg bg-slate-950 accent-orange-500"
                  />
                  <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-500">
                    <span>$500</span>
                    <span>$7,500</span>
                    <span>$15,000</span>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-300">Chaturbo Lead-to-Job Rate</span>
                    <span className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1 font-mono text-lg font-black text-white">
                      {conversionRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="65"
                    value={conversionRate}
                    onChange={(e) => setConversionRate(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer rounded-lg bg-slate-950 accent-orange-500"
                  />
                  <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-500">
                    <span>15%</span>
                    <span>35%</span>
                    <span>65%</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3 border-t border-slate-800 pt-6 text-xs text-slate-400">
                <span className="text-orange-500">✦</span>
                <span>ROI calculations assume typical contractor metrics based on local service standards.</span>
              </div>
            </div>

            <div className="grid gap-6 lg:col-span-6">
              <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-red-500/5 p-6 shadow-lg sm:p-8">
                <div className="absolute right-4 top-4 select-none font-mono text-6xl font-black text-red-500/20">LOSS</div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">Your Business Today</span>
                  <h4 className="mt-2 text-3xl font-black text-red-500 sm:text-4xl">
                    ${monthlyLeakedRevMin.toLocaleString()} – ${monthlyLeakedRevMax.toLocaleString()}
                  </h4>
                  <p className="mt-1 max-w-md text-xs leading-normal text-slate-400">
                    Lost monthly cash because homeowners hung up and called the competitor who answered first.
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-red-400">
                  <span>✕</span>
                  <span>Unsecured leads from Google Ads and Local SEO going to waste.</span>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-amber-500/5 p-6 shadow-lg sm:p-8">
                <div className="absolute right-4 top-4 select-none font-mono text-6xl font-black text-orange-500/15">SAVED</div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400">Chaturbo Lead Rescue Active</span>
                  <h4 className="mt-2 text-4xl font-black text-orange-500 sm:text-5xl">
                    +${recoveredRevenue.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ month</span>
                  </h4>
                  <p className="mt-1 max-w-md text-xs leading-normal text-slate-300">
                    Recovered gross revenue by locking in <strong className="font-black text-white">{savedJobs} additional estimate appointments</strong> on autopilot.
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-orange-500/10 pt-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <span className="text-emerald-400">✓</span>
                    <span>
                      Net Profit Boost: <strong className="font-mono text-emerald-400">${netProfitWithChaturbo.toLocaleString()}/mo</strong>
                    </span>
                  </div>
                  <button onClick={() => scrollToSection("audit-form")} className="text-xs font-bold text-white hover:underline">
                    Lock this in now →
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-850 bg-slate-900 shadow-2xl">
            <div className="border-b border-slate-850 p-6">
              <h3 className="text-lg font-black text-white">Side-by-Side Response Architecture Comparison</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[600px] w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-850 bg-slate-950 text-xs font-mono uppercase tracking-widest text-slate-400">
                    <th className="p-5 font-semibold">Evaluation Metric</th>
                    <th className="p-5 font-semibold">Your Business Today</th>
                    <th className="p-5 font-semibold text-orange-500">With Chaturbo Lead Rescue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-sm">
                  <tr>
                    <td className="p-5 font-semibold text-slate-300">Response Speed</td>
                    <td className="p-5 text-slate-400">30 minutes to 4 hours (or next morning)</td>
                    <td className="p-5 font-bold text-orange-500">3 Seconds Flat (via SMS)</td>
                  </tr>
                  <tr>
                    <td className="p-5 font-semibold text-slate-300">Lead Capture Rate</td>
                    <td className="p-5 text-slate-400">Less than 40% of missed calls call back</td>
                    <td className="p-5 font-bold text-emerald-400">Greater than 85% of missed traffic captured</td>
                  </tr>
                  <tr>
                    <td className="p-5 font-semibold text-slate-300">Prospect Action</td>
                    <td className="p-5 text-slate-400">Hangs up, returns to search, calls next contractor</td>
                    <td className="p-5 text-slate-200">Stays highly engaged on SMS thread and books directly</td>
                  </tr>
                  <tr className="bg-orange-500/[0.02]">
                    <td className="p-5 font-black text-white">Monthly Leaked Revenue</td>
                    <td className="p-5 font-mono font-bold text-red-500">$5,000 to $15,000+ Lost Cash</td>
                    <td className="p-5 font-mono font-black text-emerald-500">$0. Every possible call is fully secured.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.08),_transparent_30%)] pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="mb-3.5 block text-xs font-mono font-bold uppercase tracking-widest text-orange-500">
              Transparent Pricing
            </span>
            <h2 className="mb-6 text-3xl font-black tracking-tight text-white sm:text-5xl">
              Lock in your territory. Secure your leads.
            </h2>
            <p className="text-sm text-slate-400 sm:text-base">
              We do not sell complicated software dashboards that take months to learn. We build, install, integrate, and maintain your entire text-back architecture for you.
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="relative rounded-3xl border-2 border-orange-500 bg-slate-900 p-6 shadow-[0_0_50px_rgba(249,115,22,0.15)] sm:p-10">
              <div className="absolute left-1/2 top-[-14px] -translate-x-1/2 rounded-full bg-orange-500 px-6 py-1.5 text-xs font-black uppercase tracking-widest text-slate-950 shadow-lg">
                Exclusive Trade Partner Slot
              </div>

              <div className="mb-10 pt-4 text-center">
                <h3 className="mb-2 text-2xl font-black uppercase tracking-wider text-orange-500">
                  Chaturbo Lead Rescue Engine
                </h3>
                <p className="mb-6 text-xs text-slate-400">Fully custom engineered, deployed, and supported for your territory.</p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                  <div className="text-center">
                    <span className="text-4xl font-black text-white sm:text-5xl">$997</span>
                    <span className="mt-1 block text-xs uppercase tracking-wider text-slate-400">One-Time Setup Fee</span>
                  </div>
                  <div className="hidden text-3xl text-slate-700 sm:block">+</div>
                  <div className="text-center">
                    <span className="text-3xl font-black text-slate-200 sm:text-4xl">
                      $299<span className="text-base font-normal text-slate-500">/mo</span>
                    </span>
                    <span className="mt-1 block text-xs uppercase tracking-wider text-slate-400">Maintenance Retainer</span>
                  </div>
                </div>
              </div>

              <div className="mb-10 border-t border-slate-800 pt-8 text-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["Custom tracking line config", "Setup and provisioning of a local virtual line matching your region."],
                    ["Workflow custom training", "AI trained on your prices, trades, service areas, and company voice."],
                    ["CRM & calendar integration", "Automated synchronization to Jobber, Housecall Pro, or simple calendar links."],
                    ["Prompt & latency tuning", "We optimize response behavior to keep replies under 3 seconds."],
                    ["Unlimited SMS conversations", "No limits on conversations, lead capture sessions, or follow-ups."],
                    ["Territory exclusivity", "We license Chaturbo to only one contractor per trade, per territory."]
                  ].map(([title, text]) => (
                    <div key={title} className="flex items-start gap-3">
                      <span className="mt-0.5 text-orange-500">✓</span>
                      <div>
                        <span className="block font-bold text-slate-200">{title}</span>
                        <span className="text-xs text-slate-400">{text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                <div className="flex flex-col items-start gap-4 sm:flex-row">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-orange-500/20 bg-orange-500/10">
                    <span className="text-2xl text-orange-500">⛨</span>
                  </div>
                  <div>
                    <h4 className="mb-1.5 text-lg font-black text-white">Our Unconditional 30-Day Cash Guarantee</h4>
                    <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
                      If our text-back engine does not save and book at least 3 high-ticket jobs for your business within the first 30 days of going live, you pay absolutely nothing. We will refund your $997 setup fee entirely and cancel your retainer.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => scrollToSection("audit-form")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-10 py-4 text-sm font-bold text-slate-950 transition-all hover:bg-orange-600 active:scale-95 sm:text-base"
                >
                  <span>SECURE MY TRADE SLOT & GET AUDIT</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-slate-900 bg-slate-900/10 py-24">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-16 text-center">
            <span className="mb-3 block text-xs font-mono font-bold uppercase tracking-widest text-orange-500">Contractor FAQ</span>
            <h2 className="text-3xl font-black tracking-tight text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-slate-850 bg-slate-900 p-6">
                <h3 className="mb-2 flex items-start gap-2 text-base font-black text-white sm:text-lg">
                  <span className="select-none text-orange-500">Q.</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="pl-5 text-xs leading-relaxed text-slate-400 sm:text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="audit-form" className="relative border-t border-slate-900 bg-slate-900/30 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.06),_transparent_28%)] pointer-events-none" />
        <div className="relative mx-auto max-w-xl px-4">
          {auditStep === "idle" ? (
            <div className="rounded-3xl border border-slate-850 bg-slate-900 p-6 shadow-2xl sm:p-10">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-500">
                  ✦
                </div>
                <h2 className="mb-2 text-2xl font-black text-white sm:text-3xl">Get Your Free Missed-Call Audit</h2>
                <p className="text-xs text-slate-400 sm:text-sm">
                  We will analyze your response speed, local visibility, and calculate your exact monthly leaked revenue.
                </p>
              </div>

              <form onSubmit={handleAuditSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 ml-1 block text-xs font-black uppercase text-slate-400">Company Name</label>
                  <input
                    required
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Apex Plumbing & HVAC"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 ml-1 block text-xs font-black uppercase text-slate-400">Owner Name</label>
                    <input
                      required
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 ml-1 block text-xs font-black uppercase text-slate-400">Trade Category</label>
                    <select
                      value={formData.trade}
                      onChange={(e) => setFormData({ ...formData, trade: e.target.value })}
                      className="w-full cursor-pointer appearance-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                    >
                      <option>Roofing</option>
                      <option>HVAC</option>
                      <option>Plumbing</option>
                      <option>Electrical</option>
                      <option>Other Services</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 ml-1 block text-xs font-black uppercase text-slate-400">Business Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 000-0000"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:border-orange-500 focus:outline-none"
                  />
                  <span className="ml-1 mt-1 block text-[10px] text-slate-500">Where we should text your custom video audit.</span>
                </div>

                <div>
                  <label className="mb-1.5 ml-1 block text-xs font-black uppercase text-slate-400">Website URL</label>
                  <input
                    required
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://www.apexplumbing.com"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="pt-4">
                  <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-bold text-slate-950 transition-all hover:bg-orange-600 active:scale-95">
                    <span>SECURE MY TERRITORY & AUDIT</span>
                    <span>→</span>
                  </button>
                  <span className="mt-3 block text-center text-[10px] font-mono text-slate-500">
                    Your data is encrypted. We never share phone list data.
                  </span>
                </div>
              </form>
            </div>
          ) : null}

          {auditStep === "scanning" ? (
            <div className="flex min-h-[480px] flex-col items-center justify-center rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl sm:p-12">
              <div className="relative mb-8">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-slate-850">
                  <span className="text-lg font-black text-orange-500 font-mono">{auditProgress}%</span>
                </div>
                <div className="absolute inset-0 h-24 w-24 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
              </div>

              <span className="mb-2 text-xs font-black uppercase tracking-widest text-orange-500 font-mono">
                System Line Test Active
              </span>

              <h3 className="mb-4 text-xl font-black text-white">Analyzing {formData.companyName || "Your Business"}...</h3>

              <div className="w-full max-w-sm space-y-1.5 rounded-xl border border-slate-850 bg-slate-950 p-4 text-left font-mono text-xs text-slate-300 shadow-inner">
                <div className="text-slate-500">&gt; Initializing Chaturbo engine v2.6</div>
                <div className="text-emerald-400">&gt; Target Phone: {formData.phone}</div>
                <div className="text-emerald-400">&gt; Target URL: {formData.website}</div>
                <div className="animate-pulse text-orange-400">&gt; {scanMessage}</div>
              </div>

              <p className="mt-6 max-w-xs text-xs leading-normal text-slate-500">
                Our cloud nodes are running deep metrics and analyzing missed-call latency ratios. Do not close this tab.
              </p>
            </div>
          ) : null}

          {auditStep === "success" ? (
            <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/30 bg-slate-900 p-8 text-center shadow-2xl sm:p-12">
              <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[80px]" />
              <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
                <span className="text-3xl text-emerald-400">✓</span>
              </div>

              <h3 className="relative mt-6 text-2xl font-black text-white sm:text-3xl">Line Securement Locked.</h3>
              <span className="relative mt-4 inline-block rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-400">
                {formData.trade} Slot Secured
              </span>

              <div className="relative mx-auto mb-8 mt-6 max-w-md space-y-4 text-sm leading-relaxed text-slate-300 sm:text-base">
                <p>
                  Thank you, <strong className="text-white">{formData.ownerName}</strong>. We have registered{" "}
                  <strong className="text-white">{formData.companyName}</strong> as our exclusive partner candidate for the{" "}
                  {formData.trade} category in your territory.
                </p>
                <p className="text-xs text-slate-400 sm:text-sm">
                  Our lead engineer is compiling your custom missed-call revenue audit and competitive speed analysis. We will text a private Loom walkthrough link directly to{" "}
                  <strong className="font-mono text-slate-200">{formData.phone}</strong> within 24 hours.
                </p>
              </div>

              <div className="relative inline-flex items-center gap-3 rounded-xl border border-slate-850 bg-slate-950 px-4 py-3 font-mono text-xs text-slate-400">
                <span className="text-emerald-400">◷</span>
                <span>Expected Delivery: Today within 24 hours</span>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <footer className="relative z-10 border-t border-slate-900 bg-slate-950 py-16">
        <div className="mx-auto mb-12 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="space-y-4 md:col-span-5">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-orange-500 p-1.5 shadow-[0_0_12px_rgba(249,115,22,0.4)]">
                  <span className="block text-slate-950">⚡</span>
                </div>
                <span className="text-xl font-black uppercase tracking-tighter text-white">Chaturbo</span>
              </div>
              <p className="max-w-sm text-xs leading-relaxed text-slate-400 sm:text-sm">
                The high-converting missed call lead rescue engine for US trade contractors. Do not let marketing dollars slip to local rivals.
              </p>
            </div>

            <div className="space-y-3 text-xs sm:text-sm md:col-span-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">Territories We License</h4>
              <div className="grid grid-cols-2 gap-2 text-slate-400">
                <span>🏠 Roofing Pros</span>
                <span>❄️ HVAC Technicians</span>
                <span>💧 Plumbers</span>
                <span>⚡ Electricians</span>
                <span>🛠️ Solar Installers</span>
                <span>🏗️ General Contractors</span>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm md:col-span-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">Contact Chaturbo</h4>
              <p className="text-slate-400">
                Questions? Speak to an optimization expert:
                <br />
                <a href="mailto:hello@chaturbo.com" className="font-mono font-bold text-white transition-colors hover:text-orange-500">
                  hello@chaturbo.com
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-900 pt-6 text-center text-[11px] uppercase tracking-widest text-slate-600">
          © {new Date().getFullYear()} Chaturbo Lead Rescue
        </div>
      </footer>
    </main>
  );
}
