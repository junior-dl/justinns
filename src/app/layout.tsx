import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: { default: "JustInns — hotels, inns & pension houses", template: "%s · JustInns" },
  description: "Find and book a room at a hotel, inn or pension house. A portfolio demo with fictional lodgings.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="bg-ink px-4 py-1.5 text-center text-xs text-sand-100">
          Demo site — every lodging is fictional and payments are simulated.
        </div>
        <Header />
        <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
