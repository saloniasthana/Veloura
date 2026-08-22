const GRADIENTS = [
  "from-[#e9dcc3] via-[#d9c9a8] to-[#4a453e]",
  "from-[#f1ede5] via-[#d9c9a8] to-[#8c8579]",
  "from-[#4a453e] via-[#8c8579] to-[#e9dcc3]",
  "from-[#d9c9a8] via-[#b18a52] to-[#1a1815]",
];

export default function Placeholder({
  seed = 0,
  className = "",
  label,
}: {
  seed?: number;
  className?: string;
  label?: string;
}) {
  const gradient = GRADIENTS[seed % GRADIENTS.length];
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${className}`}
    >
      <div className="absolute inset-0 mix-blend-overlay opacity-30 [background-image:radial-gradient(circle_at_20%_20%,#fff,transparent_40%)]" />
      {label ? (
        <span className="absolute bottom-3 left-3 font-display text-xs tracking-luxe uppercase text-ivory/80">
          {label}
        </span>
      ) : null}
    </div>
  );
}
