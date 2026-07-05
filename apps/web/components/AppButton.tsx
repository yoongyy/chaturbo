import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "subtle" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-orange-500 text-slate-950 shadow-[0_16px_30px_rgba(249,115,22,0.22)] hover:bg-orange-400",
  secondary: "border border-white/10 bg-white/8 text-white hover:bg-white/12",
  ghost: "text-slate-200 hover:bg-white/8",
  subtle: "border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50",
  danger: "bg-rose-500 text-white hover:bg-rose-400"
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-sm",
  lg: "px-5 py-3.5 text-base"
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-50";

export function buttonClassName(variant: ButtonVariant = "primary", size: ButtonSize = "md", className = "") {
  return [baseStyles, variantStyles[variant], sizeStyles[size], className].filter(Boolean).join(" ");
}

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export function AppButton({ variant = "primary", size = "md", className = "", children, ...props }: AppButtonProps) {
  return (
    <button className={buttonClassName(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

interface AppLinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export function AppLinkButton({ href, variant = "primary", size = "md", className = "", children, ...props }: AppLinkButtonProps) {
  return (
    <Link className={buttonClassName(variant, size, className)} href={href} {...props}>
      {children}
    </Link>
  );
}
