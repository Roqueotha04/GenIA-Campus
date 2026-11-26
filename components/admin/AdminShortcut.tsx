import Link from "next/link";

interface AdminShortcutProps {
  href: string;
  title: string;
  description: string;
  count: number;
  countLabel: string;
}

export function AdminShortcut({ href, title, description, count, countLabel }: AdminShortcutProps) {
  return (
    <Link
      href={href}
      className="block rounded-sm border border-line bg-surface p-6 transition-colors hover:border-navy md:p-8"
    >
      <p className="font-heading text-4xl font-semibold tracking-tight text-primary">{count}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.22em] text-muted">{countLabel}</p>
      <h2 className="mt-6 font-heading text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
    </Link>
  );
}
