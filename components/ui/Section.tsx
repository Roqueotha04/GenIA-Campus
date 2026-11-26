import type { ReactNode } from "react";

type SectionDensity = "compact" | "editorial";

interface SectionProps {
  id?: string;
  className?: string;
  density?: SectionDensity;
  children: ReactNode;
}

const densityClasses: Record<SectionDensity, string> = {
  compact: "py-8 md:py-10",
  editorial: "py-16 md:py-24",
};

export function Section({ id, className = "", density = "compact", children }: SectionProps) {
  return (
    <section id={id} className={`relative scroll-mt-16 ${densityClasses[density]} ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-6 md:px-8">{children}</div>
    </section>
  );
}
