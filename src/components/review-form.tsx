"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { useSubmitReview } from "@/composables/use-reviews";
import { Alert, Button, Field, Input, Textarea } from "./ui";

export function ReviewForm({ lodgingId, onDone }: { lodgingId: number; onDone: () => Promise<void> }) {
  const [rating, setRating] = useState(5);
  const [sent, setSent] = useState(false);
  const { submit, busy, error } = useSubmitReview(onDone);

  if (sent) return <Alert tone="success">Thanks — your review is up.</Alert>;
  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        if (await submit({ lodgingId, rating, title: String(f.get("title")), comment: String(f.get("comment")) })) setSent(true);
      }}
    >
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((i) => (
          <button type="button" key={i} role="radio" aria-checked={rating === i} aria-label={`${i} star${i > 1 ? "s" : ""}`} onClick={() => setRating(i)}>
            <Star size={24} className={i <= rating ? "fill-clay-500 text-clay-500" : "text-sand-200"} />
          </button>
        ))}
      </div>
      <Field label="Title"><Input name="title" required maxLength={100} placeholder="Sum up your stay" /></Field>
      <Field label="Your review"><Textarea name="comment" required minLength={10} maxLength={1000} placeholder="What stood out?" /></Field>
      {error && <Alert>{error}</Alert>}
      <Button disabled={busy}>{busy ? "Posting…" : "Post review"}</Button>
    </form>
  );
}
