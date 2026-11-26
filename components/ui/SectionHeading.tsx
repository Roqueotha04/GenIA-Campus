import type { ReactNode } from "react";

type HeadingTone = "default" | "onDark";
type HeadingLevel = 1 | 2;

interface SectionHeadingProps {
  title: string;
  accent?: string;
  eyebrow?: string;
  subtitle?: ReactNode;
  tone?: HeadingTone;
  level?: HeadingLevel;
}

const toneClasses: Record<HeadingTone, { eyebrow: string; title: string; accent: string; subtitle: string }> = {
  default: {
    eyebrow: "text-muted",
    title: "text-foreground",
    accent: "text-primary",
    subtitle: "text-muted",
  },
  onDark: {
    eyebrow: "text-white/60",
    title: "text-white",
    accent: "text-cyan",
    subtitle: "text-white/70",
  },
};

const titleSizeClasses: Record<HeadingLevel, string> = {
  1: "text-2xl md:text-3xl",
  2: "text-xl md:text-2xl",
};

export function SectionHeading({
  title,
  accent,
  eyebrow,
  subtitle,
  tone = "default",
  level = 2,
}: SectionHeadingProps) {
  const styles = toneClasses[tone];
  const HeadingTag = level === 1 ? "h1" : "h2";

  return (
    <div>
      {eyebrow && <p className={`mb-1 text-sm ${styles.eyebrow}`}>{eyebrow}</p>}
      <HeadingTag
        className={`font-heading font-semibold leading-tight tracking-tight ${titleSizeClasses[level]} ${styles.title}`}
      >
        {title}
        {accent && <span className={`font-normal ${styles.accent}`}> {accent}</span>}
      </HeadingTag>
      {subtitle && (
        <p className={`mt-2 max-w-2xl text-sm leading-relaxed md:text-base ${styles.subtitle}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
