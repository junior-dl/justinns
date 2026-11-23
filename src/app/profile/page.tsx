"use client";
import { useProfile } from "@/composables/use-profile";
import { RequireAuth } from "@/components/require-auth";
import { Alert, Button, Card, Field, Input, PageHeader, Skeleton } from "@/components/ui";
import { fmtDate } from "@/lib/format";

function ProfileForm() {
  const { profile, save, saving, message } = useProfile();
  if (!profile) return <Skeleton className="h-72" />;
  return (
    <Card className="max-w-xl p-6">
      <form className="space-y-4" onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        save({ name: String(f.get("name")), phone: String(f.get("phone")) || null, address: String(f.get("address")) || null });
      }}>
        <p className="text-sm text-muted">{profile.email} · member since {fmtDate(profile.createdAt)}</p>
        <Field label="Full name"><Input name="name" defaultValue={profile.name} required /></Field>
        <Field label="Phone"><Input name="phone" defaultValue={profile.phone ?? ""} /></Field>
        <Field label="Address"><Input name="address" defaultValue={profile.address ?? ""} /></Field>
        {message && <Alert tone={message === "Saved." ? "success" : "error"}>{message}</Alert>}
        <Button disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </form>
    </Card>
  );
}

export default function ProfilePage() {
  return <><PageHeader eyebrow="Account" title="Your profile" /><RequireAuth><ProfileForm /></RequireAuth></>;
}
