export function Isotype({ className = "h-12 w-12 text-2xl" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-flex items-center justify-center rounded-full bg-primary font-heading font-bold text-white ${className}`}
    >
      G
    </span>
  );
}
