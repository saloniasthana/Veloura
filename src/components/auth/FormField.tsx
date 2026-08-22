export default function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs tracking-luxe uppercase mb-2 block">
        {label}
      </span>
      {children}
      {error ? <span className="text-xs text-red-700 mt-1.5 block">{error}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full border border-line px-4 py-3 text-sm bg-ivory focus:outline-none focus:border-ink transition-colors";
