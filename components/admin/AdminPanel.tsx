import type { ReactNode } from "react";

interface AdminPanelProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AdminPanel({ title, description, children }: AdminPanelProps) {
  return (
    <section className="rounded-sm border border-line bg-surface p-4 md:p-5">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {description && <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
