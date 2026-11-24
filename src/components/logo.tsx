import clsx from "clsx";

/** The original JustInns face logo + wordmark. */
export function Logo({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-mark.png" alt="" width={size} height={size} className="shrink-0 rounded-full" />
      <span className="font-display text-xl font-semibold tracking-tight">JustInns</span>
    </span>
  );
}
