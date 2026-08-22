import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="w-full mx-auto max-w-7xl px-6 lg:px-10 py-32 text-center">
        <p className="text-xs tracking-luxe uppercase text-gold mb-4">404</p>
        <h1 className="font-display text-4xl md:text-5xl mb-6">
          This page has left the collection.
        </h1>
        <p className="text-charcoal mb-10">
          The piece you&apos;re looking for may have sold out or moved.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center border border-ink text-xs tracking-luxe uppercase px-8 py-3.5 hover:bg-ink hover:text-ivory transition-colors duration-300"
        >
          Continue Shopping
        </Link>
      </main>
      <Footer />
    </>
  );
}
