import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="font-display text-6xl text-clay-500">404</p>
      <p className="mt-2 text-muted">That page checked out early.</p>
      <Link href="/" className="mt-6 inline-block text-pine-600 underline">Back home</Link>
    </div>
  );
}
