import clsx from "clsx";

/** JustInns mark + wordmark. The mark lives in /public/logo.svg (also the favicon). */
export function Logo({ className, size = 34 }: { className?: string; size?: number }) {
  return (
    <span className={clsx("inline-flex items-center gap-2", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="" width={size} height={size} className="shrink-0" />
      <span className="font-display text-2xl tracking-tight">Just<span className="text-clay-500">Inns</span></span>
    </span>
  );
}
