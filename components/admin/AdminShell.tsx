import type { ReactNode } from "react";
import { AdminNav } from "./AdminNav";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:grid md:grid-cols-[11rem_minmax(0,1fr)] md:gap-8 md:px-8 md:py-8 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="md:sticky md:top-6 md:self-start">
          <AdminNav />
        </aside>
        <div className="mt-6 min-w-0 md:mt-0">{children}</div>
      </div>
    </div>
  );
}
