import Image from "next/image";
import Placeholder from "./Placeholder";

export default function ProductImage({
  src,
  seed,
  alt,
  className = "",
  label,
}: {
  src?: string;
  seed: number;
  alt: string;
  className?: string;
  label?: string;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
      </div>
    );
  }
  return <Placeholder seed={seed} className={className} label={label} />;
}
