import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";

export default function InfoPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="w-full mx-auto max-w-3xl px-6 lg:px-10 py-20">
        <p className="text-xs tracking-luxe uppercase text-gold mb-4">{eyebrow}</p>
        <h1 className="font-display text-4xl md:text-5xl mb-6">{title}</h1>
        {intro ? (
          <p className="text-lg text-charcoal leading-relaxed mb-12">{intro}</p>
        ) : (
          <div className="mb-4" />
        )}
        <div className="space-y-8 text-charcoal leading-relaxed [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-ink [&_h2]:mb-3 [&_p]:mb-3">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
