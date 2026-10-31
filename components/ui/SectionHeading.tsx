import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";

type HeadingTone = "default" | "onDark";

interface SectionHeadingProps {
  title: string;
  accent?: string;
  eyebrow?: string;
  subtitle?: ReactNode;
  tone?: HeadingTone;
  level?: 1 | 2;
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
      {eyebrow && (
        <div className={`mb-5 ${styles.eyebrow}`}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      )}
      <HeadingTag
        className={`font-heading text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl ${styles.title}`}
      >
        {title}
        {accent && (
          <span
            className={`mt-2 block font-accent text-2xl font-normal italic tracking-normal md:text-3xl ${styles.accent}`}
          >
            {accent}
          </span>
        )}
      </HeadingTag>
      {subtitle && (
        <p className={`mt-5 max-w-xl text-base leading-relaxed md:text-lg ${styles.subtitle}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
