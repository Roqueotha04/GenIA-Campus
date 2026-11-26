import type { ReactNode } from "react";

interface AdminDetailLayoutProps {
  aside: ReactNode;
  children: ReactNode;
}

export function AdminDetailLayout({ aside, children }: AdminDetailLayoutProps) {
  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="min-w-0 space-y-5">{children}</div>
      <aside className="min-w-0 space-y-5">{aside}</aside>
    </div>
  );
}
