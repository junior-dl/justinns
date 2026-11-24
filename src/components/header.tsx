"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/composables/use-auth";
import { Logo } from "./logo";

const nav = [
  { href: "/lodgings?type=hotel", label: "Hotels" },
  { href: "/lodgings?type=inn", label: "Inns" },
  { href: "/lodgings?type=pension", label: "Pensions" },
];

export function Header() {
  const { user, isAdmin, signOut, isPending } = useAuth();
  const [open, setOpen] = useState(false);
  const path = usePathname();

  const links = (
    <>
      {nav.map((n) => <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="hover:text-pine-600">{n.label}</Link>)}
    </>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-sand-200/80 bg-sand-50/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5">
        <Link href="/" aria-label="JustInns home"><Logo /></Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">{links}</nav>
        <div className="hidden items-center gap-3 text-sm md:flex">
          {isPending ? null : user ? (
            <>
              {isAdmin && <Link href="/admin" className={clsx("hover:text-pine-600", path.startsWith("/admin") && "text-pine-600")}>Admin</Link>}
              <Link href="/bookings" className="hover:text-pine-600">My trips</Link>
              <Link href="/favorites" className="hover:text-pine-600">Saved</Link>
              <Link href="/profile" className="grid size-8 place-items-center rounded-full bg-pine-600 text-xs font-semibold text-white" title={user.name}>
                {user.name.slice(0, 1).toUpperCase()}
              </Link>
              <button onClick={signOut} className="text-muted hover:text-ink">Log out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-pine-600">Log in</Link>
              <Link href="/signup" className="rounded-full bg-pine-600 px-4 py-2 text-white hover:bg-pine-700">Sign up</Link>
            </>
          )}
        </div>
        <button className="md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <nav className="flex flex-col gap-4 border-t border-sand-200 px-5 py-4 text-sm md:hidden">
          {links}
          {user ? (
            <>
              {isAdmin && <Link href="/admin" onClick={() => setOpen(false)}>Admin</Link>}
              <Link href="/bookings" onClick={() => setOpen(false)}>My trips</Link>
              <Link href="/favorites" onClick={() => setOpen(false)}>Saved</Link>
              <Link href="/profile" onClick={() => setOpen(false)}>Profile</Link>
              <button className="text-left text-muted" onClick={signOut}>Log out</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)}>Log in</Link>
              <Link href="/signup" onClick={() => setOpen(false)}>Sign up</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
