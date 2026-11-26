import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";

type HeadingTone = "default" | "onDark";
type HeadingSize = "compact" | "editorial";
type HeadingLevel = 1 | 2;

interface SectionHeadingProps {
  title: string;
  accent?: string;
  eyebrow?: string;
  subtitle?: ReactNode;
  tone?: HeadingTone;
  level?: HeadingLevel;
  size?: HeadingSize;
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

const compactTitleClasses: Record<HeadingLevel, string> = {
  1: "text-2xl md:text-3xl",
  2: "text-xl md:text-2xl",
};

interface HeadingPartProps {
  text: string;
  colorClass: string;
}

function EditorialEyebrow({ text, colorClass }: HeadingPartProps) {
  return (
    <div className={`mb-5 ${colorClass}`}>
      <Eyebrow>{text}</Eyebrow>
    </div>
  );
}

function CompactEyebrow({ text, colorClass }: HeadingPartProps) {
  return <p className={`mb-1 text-sm ${colorClass}`}>{text}</p>;
}

function EditorialAccent({ text, colorClass }: HeadingPartProps) {
  return (
    <span
      className={`mt-2 block font-accent text-2xl font-normal italic tracking-normal md:text-3xl ${colorClass}`}
    >
      {text}
    </span>
  );
}

function CompactAccent({ text, colorClass }: HeadingPartProps) {
  return <span className={`font-normal ${colorClass}`}> {text}</span>;
}

export function SectionHeading({
  title,
  accent,
  eyebrow,
  subtitle,
  tone = "default",
  level = 2,
  size = "compact",
}: SectionHeadingProps) {
  const styles = toneClasses[tone];
  const HeadingTag = level === 1 ? "h1" : "h2";
  const isEditorial = size === "editorial";
  const HeadingEyebrow = isEditorial ? EditorialEyebrow : CompactEyebrow;
  const HeadingAccent = isEditorial ? EditorialAccent : CompactAccent;
  const titleSizeClasses = isEditorial
    ? "text-3xl leading-[1.1] md:text-5xl"
    : `leading-tight ${compactTitleClasses[level]}`;
  const subtitleClasses = isEditorial
    ? "mt-5 max-w-xl text-base md:text-lg"
    : "mt-2 max-w-2xl text-sm md:text-base";

  return (
    <div>
      {eyebrow && <HeadingEyebrow text={eyebrow} colorClass={styles.eyebrow} />}
      <HeadingTag
        className={`font-heading font-semibold tracking-tight ${titleSizeClasses} ${styles.title}`}
      >
        {title}
        {accent && <HeadingAccent text={accent} colorClass={styles.accent} />}
      </HeadingTag>
      {subtitle && <p className={`leading-relaxed ${subtitleClasses} ${styles.subtitle}`}>{subtitle}</p>}
    </div>
  );
}
