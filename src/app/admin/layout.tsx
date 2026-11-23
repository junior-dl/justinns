"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { RequireAuth } from "@/components/require-auth";

const tabs = [{ href: "/admin", label: "Overview" }, { href: "/admin/lodgings", label: "Lodgings" }, { href: "/admin/bookings", label: "Bookings" }];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <RequireAuth admin>
      <nav className="mb-8 flex gap-2 border-b border-sand-200 pb-3 text-sm">
        {tabs.map((t) => {
          const on = t.href === "/admin" ? path === "/admin" : path.startsWith(t.href);
          return <Link key={t.href} href={t.href} className={clsx("rounded-full px-4 py-1.5", on ? "bg-ink text-white" : "hover:bg-sand-100")}>{t.label}</Link>;
        })}
      </nav>
      {children}
    </RequireAuth>
  );
}
