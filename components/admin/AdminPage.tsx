import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface AdminBackLink {
  href: string;
  label: string;
}

interface AdminPageProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  backLink?: AdminBackLink;
  children: ReactNode;
}

function AdminBackLinkAnchor({ href, label }: AdminBackLink) {
  return (
    <Link
      href={href}
      className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
    >
      <ArrowLeftIcon className="h-4 w-4" />
      {label}
    </Link>
  );
}

export function AdminPage({ title, subtitle, actions, backLink, children }: AdminPageProps) {
  return (
    <div>
      {backLink && <AdminBackLinkAnchor {...backLink} />}
      <header className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 break-words">
          <SectionHeading level={1} title={title} subtitle={subtitle} />
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </header>
      <div className="mt-6 space-y-5">{children}</div>
    </div>
  );
}
