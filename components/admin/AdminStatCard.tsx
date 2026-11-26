import Link from "next/link";

interface AdminStatCardProps {
  href: string;
  label: string;
  value: number;
}

export function AdminStatCard({ href, label, value }: AdminStatCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-sm border border-line bg-surface px-4 py-3 transition-colors hover:border-navy"
    >
      <p className="text-2xl font-semibold tabular-nums text-foreground">{value}</p>
      <p className="mt-0.5 text-sm text-muted">{label}</p>
    </Link>
  );
}
