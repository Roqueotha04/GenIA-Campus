import Image from "next/image";

export function Logo({ className = "h-6" }: { className?: string }) {
  return (
    <Image
      src="/logo-generacion-ia.png"
      alt="Generación IA"
      width={2698}
      height={336}
      priority
      className={`w-auto ${className}`}
    />
  );
}
