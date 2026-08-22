import AnnouncementBar from "../AnnouncementBar";
import Header from "../Header";
import Footer from "../Footer";

export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="w-full mx-auto max-w-md px-6 py-20">
        <p className="text-xs tracking-luxe uppercase text-gold mb-3 text-center">
          {eyebrow}
        </p>
        <h1 className="font-display text-3xl md:text-4xl mb-3 text-center">
          {title}
        </h1>
        <p className="text-sm text-charcoal mb-10 text-center">{subtitle}</p>
        {children}
      </main>
      <Footer />
    </>
  );
}
