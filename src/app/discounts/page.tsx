"use client";
import { useDiscounts } from "@/composables/use-discounts";
import { Card, PageHeader } from "@/components/ui";

export default function DiscountsPage() {
  const discounts = useDiscounts();
  return (
    <>
      <PageHeader eyebrow="Deals" title="Discount codes">Enter a code on the booking page to take a percentage off your stay.</PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {discounts.map((d) => (
          <Card key={d.id} className="space-y-2 p-6">
            <p className="text-4xl font-display text-clay-500">{d.percentOff}% off</p>
            <p className="inline-block rounded-lg border border-dashed border-ink/30 px-3 py-1 font-mono text-sm">{d.code}</p>
            <p className="text-sm text-muted">{d.description}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
