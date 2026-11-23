"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/composables/use-auth";
import { Alert, Button, Card, Field, Input } from "./ui";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const next = useSearchParams().get("next") || "/";
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";

  return (
    <Card className="mx-auto max-w-md p-8">
      <h1 className="text-3xl">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
      <p className="mt-1 text-sm text-muted">{mode === "login" ? "Log in to book and see your trips." : "It takes a minute."}</p>
      <form className="mt-6 space-y-4" onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        setBusy(true);
        setError(null);
        try {
          if (mode === "login") await signIn(String(f.get("email")), String(f.get("password")));
          else await signUp({ name: String(f.get("name")), email: String(f.get("email")), password: String(f.get("password")), phone: String(f.get("phone") || "") || undefined });
          router.push(safeNext);
          router.refresh();
        } catch (err) {
          setError((err as Error).message);
          setBusy(false);
        }
      }}>
        {mode === "signup" && <Field label="Full name"><Input name="name" required autoComplete="name" /></Field>}
        <Field label="Email"><Input name="email" type="email" required autoComplete="email" /></Field>
        {mode === "signup" && <Field label="Phone (optional)"><Input name="phone" inputMode="tel" autoComplete="tel" /></Field>}
        <Field label="Password" hint={mode === "signup" ? "At least 8 characters." : undefined}>
          <Input name="password" type="password" required minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} />
        </Field>
        {error && <Alert>{error}</Alert>}
        <Button className="w-full" disabled={busy}>{busy ? "One moment…" : mode === "login" ? "Log in" : "Sign up"}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        {mode === "login" ? <>New here? <Link href={`/signup?next=${encodeURIComponent(safeNext)}`} className="text-pine-600 underline">Create an account</Link></>
          : <>Have an account? <Link href={`/login?next=${encodeURIComponent(safeNext)}`} className="text-pine-600 underline">Log in</Link></>}
      </p>
      {mode === "login" && <p className="mt-4 rounded-xl bg-sand-100 p-3 text-xs text-muted">Demo accounts — guest: <b>guest@justinns.test</b> · admin: <b>admin@justinns.test</b> · password for both: <b>justinns-demo</b></p>}
    </Card>
  );
}
