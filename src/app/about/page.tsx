import { PageHeader } from "@/components/ui";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="max-w-2xl space-y-5 leading-relaxed">
      <PageHeader eyebrow="About" title="About JustInns" />
      <p>JustInns started as a school group project: a PHP and MySQL site for booking rooms at hotels, inns and pension houses. This version rebuilds it from the ground up with Next.js, Drizzle ORM, a Neon Postgres database, Better Auth and Neon object storage for photos.</p>
      <p>Guests can browse lodgings, check which rooms are free for their dates, apply a discount code, book with a simulated payment, cancel upcoming trips, save favorites and review places they&apos;ve stayed. Admins can add and edit lodgings, room types, rooms and photos, and manage every booking.</p>
      <p className="rounded-2xl bg-sand-100 p-5 text-sm text-muted">Every lodging, address, review and person on this site is invented for the demo. Any resemblance to a real business is a coincidence. No real payments are taken.</p>
    </div>
  );
}
