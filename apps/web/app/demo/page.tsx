"use client";

import { useState } from "react";
import Link from "next/link";
import BrandMark from "../../components/BrandMark";

const demos = [
  {
    title: "Roofing Lead Rescue",
    intro: "A homeowner calls about a ceiling leak during a storm, hits voicemail. Chaturbo text-backs in 3 seconds, captures their location, damage details, and asks them to text a photo.",
    conversation: [
      { role: "Customer", text: "Hey, I have a leak in my living room ceiling. Need someone to look at it ASAP. I'm in Dallas." },
      { role: "AI", text: "Got it, we can help with that. Can you text over a quick photo of the ceiling leak? Also, what is your name so we can get a technician scheduled?" },
      { role: "Customer", text: "[Sent photo of ceiling stain] My name is Mark." },
      { role: "AI", text: "Thanks, Mark. I've logged the leak and photo. A Dallas roofing specialist will text you at this number in 5 minutes to confirm dispatch." }
    ],
    captured: ["Living room ceiling leak", "Dallas, TX", "Photo of ceiling stain", "Mark (Lead name)"],
    automation: "Creates lead in dashboard, sends SMS notification to roofer, and uploads photos to job file."
  },
  {
    title: "Emergency Plumbing Dispatch",
    intro: "A homeowner calls with a flooded basement at 10 PM. Chaturbo texts back instantly, identifies a burst pipe, captures the address, and flags it as a High-Urgency alert to the plumber.",
    conversation: [
      { role: "AI", text: "Hi, this is QuickFlow Plumbing. Sorry we missed your call! What plumbing emergency can we help with, and what is your address?" },
      { role: "Customer", text: "My water heater just burst and there is water everywhere in my basement! Address is 415 Maple St." },
      { role: "AI", text: "That sounds urgent, Sarah. Please turn off your main water valve immediately. I am paging our emergency plumber on duty right now. What is your name?" },
      { role: "Customer", text: "It's Sarah. Please hurry!" }
    ],
    captured: ["Water heater burst / basement flooding", "415 Maple St", "High-Urgency flag", "Sarah (Lead name)"],
    automation: "Flags lead as High Urgency, triggers automated phone call alert to on-call plumber, and sends safety instructions."
  },
  {
    title: "HVAC Repair & Maintenance",
    intro: "A homeowner calls to schedule an AC tune-up. Chaturbo text-back asks for system brand, preferred appointment day, and logs details for the office scheduler.",
    conversation: [
      { role: "AI", text: "Hi, this is CoolAir Comfort. Sorry we missed your call! Are you looking for AC repair, maintenance, or a new system installation?" },
      { role: "Customer", text: "Need a regular AC maintenance check before summer. It's a Carrier unit." },
      { role: "AI", text: "Perfect. We have slots open this Thursday afternoon or Friday morning. Which works best for you? Also, what is your name?" },
      { role: "Customer", text: "Friday morning works. My name is David." }
    ],
    captured: ["AC maintenance check (Carrier unit)", "Friday morning slot", "David (Lead name)"],
    automation: "Creates a calendar draft, sends confirmation text, and notifies the office manager."
  }
];

export default function DemoPage() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "calling" | "ringing" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Interactive mock chat state
  const [mockMessages, setMockMessages] = useState<Array<{ role: "Customer" | "AI"; text: string }>>([
    { role: "AI", text: "Hi, this is Apex Roofing AI. Sorry we missed your call. What roofing service do you need today, and what city are you in?" }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleTestCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setStatus("calling");
    setErrorMessage("");

    try {
      // Direct call to our backend API
      const res = await fetch("http://localhost:4000/api/twilio/demo/test-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to trigger demo call");

      setStatus("ringing");

      // After 6 seconds, transition to the SMS sent state
      setTimeout(() => {
        setStatus("sent");
      }, 7000);

    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong.");
    }
  };

  const handleMockSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMessages = [...mockMessages, { role: "Customer" as const, text: userInput }];
    setMockMessages(newMessages);
    setUserInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      let reply = "Got it! Thanks. What is your name and email so we can reach you?";
      if (newMessages.length === 2) {
        reply = "Great. We can help with that. Are you looking for a quick repair estimate or a full replacement?";
      } else if (newMessages.length === 4) {
        reply = "Excellent. What is your name so we can follow up?";
      } else if (newMessages.length >= 6) {
        reply = "Perfect, thank you! I've logged your request and notified the manager. We'll text you a booking link in 1 minute.";
      }
      setMockMessages([...newMessages, { role: "AI" as const, text: reply }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(229,106,65,0.14),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(29,122,107,0.12),_transparent_26%),linear-gradient(180deg,_#08111a_0%,_#0e1724_36%,_#f6f1e7_36%,_#f6f1e7_100%)] px-4 py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header Block */}
        <section className="rounded-[34px] border border-slate-800 bg-[linear-gradient(180deg,_rgba(15,23,42,0.98)_0%,_rgba(7,12,20,0.96)_100%)] p-6 text-white shadow-[0_24px_80px_rgba(2,6,23,0.45)] md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-400">Interactive Sandbox</p>
          <h1 className="font-display mt-3 text-4xl font-black text-white md:text-5xl">Test Missed-Call Rescue Live</h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            See exactly how Chaturbo works. Enter your mobile number below, and our system will call your phone, simulate a missed call, and text you back automatically in 3 seconds.
          </p>
        </section>

        {/* Live Test Form & Chat Simulator Container */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Form Side */}
          <section className="rounded-[34px] border border-orange-200 bg-[#f6f1e7] p-6 shadow-[0_18px_50px_rgba(18,46,54,0.08)] md:p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-500">Live Demo Sandbox</p>
              <h2 className="font-display mt-2 text-3xl font-black text-ink">Try it on your phone</h2>
              <p className="mt-3 text-slate-600 text-sm leading-6">
                Enter your mobile number with country code (e.g. +14155552671 or +60123456789).
              </p>

              {status === "idle" && (
                <form onSubmit={handleTestCall} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 shadow-sm focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-orange-500 px-6 py-4 font-bold text-slate-950 shadow-md hover:bg-orange-600 transition-colors"
                  >
                    📞 Trigger Missed-Call Callout
                  </button>
                </form>
              )}

              {status === "calling" && (
                <div className="mt-8 text-center py-6 space-y-3 bg-white/60 rounded-3xl border border-orange-100">
                  <div className="mx-auto w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="font-bold text-slate-800">Placing outbound call...</p>
                  <p className="text-xs text-slate-500">Initializing Twilio trunk line</p>
                </div>
              )}

              {status === "ringing" && (
                <div className="mt-8 text-center py-6 space-y-3 bg-orange-100/60 rounded-3xl border border-orange-200 animate-pulse">
                  <div className="text-4xl">📳</div>
                  <p className="font-bold text-orange-800">Your phone should be ringing!</p>
                  <p className="text-xs text-slate-600 px-6">
                    **Please DECLINE or IGNORE the call** to simulate a busy/missed call event. This will trigger the automated text-back!
                  </p>
                </div>
              )}

              {status === "sent" && (
                <div className="mt-8 text-center py-6 space-y-4 bg-emerald-50 rounded-3xl border border-emerald-200">
                  <div className="text-4xl">💬</div>
                  <p className="font-bold text-emerald-800">Text-back SMS Sent!</p>
                  <p className="text-xs text-slate-600 px-6 leading-5">
                    Check your mobile messages. Reply directly to the SMS to chat with our automated AI assistant.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-xs font-bold text-orange-600 hover:underline"
                  >
                    Test another number
                  </button>
                </div>
              )}

              {status === "error" && (
                <div className="mt-8 text-center py-6 space-y-3 bg-red-50 rounded-3xl border border-red-200">
                  <div className="text-4xl">❌</div>
                  <p className="font-bold text-red-800">Call Failed</p>
                  <p className="text-xs text-red-600 px-4">{errorMessage}</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-2 text-xs font-bold text-orange-600 hover:underline"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-black/5 text-xs text-slate-500">
              ℹ️ Standard carrier rates apply. Only your phone number will be dialed for this test. We do not sell your data.
            </div>
          </section>

          {/* Web Simulator Side */}
          <section className="rounded-[34px] border border-orange-200 bg-[#f6f1e7] p-6 shadow-[0_18px_50px_rgba(18,46,54,0.08)] md:p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-500">Web Chat Simulator</p>
              <h2 className="font-display mt-2 text-3xl font-black text-ink">Test the conversation here</h2>
              <p className="mt-3 text-slate-600 text-sm leading-6">
                Don't have a US number? Simulate the conversation flow directly inside this sandbox mockup.
              </p>

              {/* Chat Viewport */}
              <div className="mt-6 rounded-3xl bg-[#0f1720] p-4 text-white h-72 overflow-y-auto flex flex-col gap-3 justify-end">
                {mockMessages.map((msg, idx) => (
                  <div
                    key={`mock-msg-${idx}`}
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-6 ${
                      msg.role === "AI" ? "bg-white/10 text-slate-100 mr-auto" : "bg-[#1d7a6b] text-white ml-auto"
                    }`}
                  >
                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] opacity-65">{msg.role}</p>
                    <p className="mt-1">{msg.text}</p>
                  </div>
                ))}

                {isTyping && (
                  <div className="bg-white/10 text-slate-300 mr-auto rounded-2xl px-4 py-2.5 text-xs flex gap-1 items-center animate-pulse">
                    <span>Typing</span>
                    <span className="w-1 h-1 bg-white rounded-full animate-bounce"></span>
                    <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleMockSend} className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Type a reply... (e.g. 'roof repair in Dallas')"
                  value={userInput}
                  disabled={isTyping}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-xs text-slate-900 shadow-sm focus:border-orange-500 focus:outline-none disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={isTyping}
                  className="rounded-2xl bg-orange-500 px-5 font-bold text-slate-950 text-xs shadow-md hover:bg-orange-600 transition-colors disabled:opacity-60"
                >
                  Send
                </button>
              </form>
            </div>
            
            <button
              onClick={() => setMockMessages([{ role: "AI", text: "Hi, this is Apex Roofing AI. Sorry we missed your call. What roofing service do you need today, and what city are you in?" }])}
              className="mt-6 text-center text-xs text-slate-500 hover:text-orange-500 underline self-center"
            >
              Reset simulator conversation
            </button>
          </section>

        </div>

        {/* Existing Static Demos */}
        <div className="grid gap-5">
          {demos.map((demo) => (
            <section key={demo.title} className="rounded-[34px] border border-orange-200 bg-[#f6f1e7] p-6 shadow-[0_18px_50px_rgba(18,46,54,0.08)] md:p-8">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-500">Demo flow</p>
                  <h2 className="font-display mt-2 text-3xl font-black text-ink">{demo.title}</h2>
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

        {/* CTA Banner */}
        <section className="rounded-[34px] border border-slate-800 bg-[linear-gradient(180deg,_rgba(15,23,42,0.98)_0%,_rgba(7,12,20,0.96)_100%)] p-6 text-white shadow-[0_24px_80px_rgba(2,6,23,0.45)] md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-400">Next step</p>
              <h2 className="font-display mt-2 text-3xl font-black md:text-4xl">Want us to build one of these for your business?</h2>
              <p className="mt-2 max-w-2xl text-slate-300">
                Start with one high-value workflow and turn it into your first live AI employee.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/apply" className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-slate-950">
                Apply for Free Setup
              </Link>
              <Link href="/apply" className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white">
                Start Free Audit
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
