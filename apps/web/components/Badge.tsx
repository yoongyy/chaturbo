import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  tone?: "default" | "good" | "warn" | "bad";
}

const tones = {
  default: "bg-slate-100 text-slate-700",
  good: "bg-emerald-100 text-emerald-700",
  warn: "bg-amber-100 text-amber-700",
  bad: "bg-rose-100 text-rose-700"
};

export default function Badge({ children, tone = "default" }: Props) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}
