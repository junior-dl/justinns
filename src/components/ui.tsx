import clsx from "clsx";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Button({ variant = "primary", className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" | "outline" }) {
  return (
    <button
      {...p}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-pine-600 text-white hover:bg-pine-700",
        variant === "outline" && "border border-sand-200 bg-white hover:border-pine-600",
        variant === "ghost" && "text-pine-700 hover:bg-pine-50",
        variant === "danger" && "border border-clay-500/40 text-clay-500 hover:bg-clay-50",
        className,
      )}
    />
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted">{hint}</span>}
    </label>
  );
}

const inputCls = "w-full rounded-xl border border-sand-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-pine-600 focus:ring-2 focus:ring-pine-600/15";

export const Input = (p: InputHTMLAttributes<HTMLInputElement>) => <input {...p} className={clsx(inputCls, p.className)} />;
export const Textarea = (p: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...p} className={clsx(inputCls, "min-h-28", p.className)} />;
export const Select = (p: SelectHTMLAttributes<HTMLSelectElement>) => <select {...p} className={clsx(inputCls, p.className)} />;

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx("rounded-2xl border border-sand-200 bg-white", className)}>{children}</div>;
}

export function Alert({ children, tone = "error" }: { children: ReactNode; tone?: "error" | "info" | "success" }) {
  return (
    <div role={tone === "error" ? "alert" : "status"} className={clsx("rounded-xl px-4 py-3 text-sm",
      tone === "error" && "bg-clay-50 text-clay-500", tone === "info" && "bg-sand-100 text-ink", tone === "success" && "bg-pine-50 text-pine-700")}>
      {children}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("animate-pulse rounded-xl bg-sand-200/70", className)} />;
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "pine" | "clay" }) {
  return (
    <span className={clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
      tone === "neutral" && "bg-sand-100 text-muted", tone === "pine" && "bg-pine-50 text-pine-700", tone === "clay" && "bg-clay-50 text-clay-500")}>
      {children}
    </span>
  );
}

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-8 space-y-2">
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay-500">{eyebrow}</p>}
      <h1 className="text-3xl md:text-4xl">{title}</h1>
      {children && <div className="text-muted">{children}</div>}
    </div>
  );
}
