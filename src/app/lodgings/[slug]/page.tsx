"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Clock, MapPin } from "lucide-react";
import { useLodgingDetail } from "@/composables/use-lodgings";
import { useBookingFlow, isoDay } from "@/composables/use-booking";
import { useAuth } from "@/composables/use-auth";
import { Gallery } from "@/components/gallery";
import { RoomTypeCard } from "@/components/room-type-card";
import { ReviewForm } from "@/components/review-form";
import { FavoriteButton } from "@/components/favorite-button";
import { Stars } from "@/components/stars";
import { Alert, Badge, Card, Skeleton } from "@/components/ui";
import { fmtDate } from "@/lib/format";

export default function LodgingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { detail, loading, error, refreshReviews } = useLodgingDetail(slug);
  const { startDraft } = useBookingFlow();
  const { user } = useAuth();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  if (error) return <Alert>{error} <Link href="/lodgings" className="underline">Back to all lodgings</Link></Alert>;
  if (loading || !detail) return <div className="space-y-6"><Skeleton className="h-10 w-80" /><Skeleton className="aspect-[16/7]" /></div>;
  const { lodging: l, images, roomTypes, reviews, rating } = detail;

  return (
    <article className="space-y-12">
      <header className="space-y-3">
        <div className="flex items-center gap-2"><Badge tone="pine">{l.type}</Badge>
          {rating.rating !== null && <span className="flex items-center gap-1.5 text-sm"><Stars value={rating.rating} />{rating.rating} · {rating.reviewCount} reviews</span>}
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl">{l.name}</h1>
            {l.tagline && <p className="mt-2 text-lg text-muted">{l.tagline}</p>}
            <p className="mt-2 flex items-center gap-1 text-sm text-muted"><MapPin size={14} />{l.address}, {l.city}</p>
          </div>
          <FavoriteButton lodgingId={l.id} className="mt-2 border border-sand-200" />
        </div>
      </header>

      <Gallery images={images} name={l.name} />

      <div className="grid gap-10 md:grid-cols-[1fr_300px]">
        <section className="space-y-4">
          <h2 className="text-2xl">About this place</h2>
          {l.description.split("\n\n").map((p, i) => <p key={i} className="leading-relaxed text-ink/85">{p}</p>)}
        </section>
        <Card className="h-fit space-y-4 p-5">
          <div className="flex gap-6 text-sm">
            <div><p className="flex items-center gap-1 text-muted"><Clock size={13} />Check-in</p><p className="font-medium">from {l.checkInTime}</p></div>
            <div><p className="flex items-center gap-1 text-muted"><Clock size={13} />Check-out</p><p className="font-medium">until {l.checkOutTime}</p></div>
          </div>
          <ul className="grid grid-cols-1 gap-2 text-sm">
            {l.amenities.map((a) => <li key={a} className="flex items-center gap-2"><Check size={14} className="text-pine-600" />{a}</li>)}
          </ul>
        </Card>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl">Rooms</h2>
        {roomTypes.map((rt) => (
          <RoomTypeCard key={rt.id} room={rt} onBook={() => {
            startDraft({
              lodgingSlug: l.slug, lodgingName: l.name, roomTypeId: rt.id, roomTypeName: rt.name, maxPersons: rt.maxPersons,
              checkIn: isoDay(7), checkOut: isoDay(9), adults: Math.min(2, rt.maxPersons), children: 0, discountCode: "",
            });
            router.push("/book");
          }} />
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl">Reviews</h2>
          {user && !showForm && <button onClick={() => setShowForm(true)} className="text-sm font-medium text-pine-600 hover:underline">Write a review</button>}
        </div>
        {showForm && <Card className="p-5"><ReviewForm lodgingId={l.id} onDone={refreshReviews} /></Card>}
        {!reviews.length && <p className="text-muted">No reviews yet.</p>}
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((r) => (
            <Card key={r.id} className="space-y-2 p-5">
              <div className="flex items-center justify-between"><Stars value={r.rating} /><span className="text-xs text-muted">{fmtDate(r.createdAt)}</span></div>
              <h3 className="text-lg">{r.title}</h3>
              <p className="text-sm text-ink/80">{r.comment}</p>
              <p className="text-xs text-muted">— {r.author}</p>
            </Card>
          ))}
        </div>
      </section>
    </article>
  );
}
