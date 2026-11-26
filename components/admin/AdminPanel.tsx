import type { ReactNode } from "react";

interface AdminPanelProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AdminPanel({ title, description, children }: AdminPanelProps) {
  return (
    <section className="rounded-sm border border-line bg-surface p-5 md:p-8">
      <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      {description && <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{description}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}
