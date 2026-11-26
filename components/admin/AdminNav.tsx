"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { CourseIcon, GridIcon, UserIcon } from "@/components/ui/icons";
import { ADMIN_COURSES_PATH, ADMIN_PATH, ADMIN_USERS_PATH } from "@/lib/admin/admin-paths";

interface AdminNavItem {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}

const adminNavItems: AdminNavItem[] = [
  { href: ADMIN_PATH, label: "Resumen", Icon: GridIcon },
  { href: ADMIN_USERS_PATH, label: "Usuarios", Icon: UserIcon },
  { href: ADMIN_COURSES_PATH, label: "Cursos", Icon: CourseIcon },
];

function isNavItemActive(pathname: string, href: string): boolean {
  if (href === ADMIN_PATH) return pathname === ADMIN_PATH;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function buildNavLinkClasses(isActive: boolean): string {
  const stateClasses = isActive
    ? "border-primary text-primary md:bg-primary/10"
    : "border-transparent text-muted hover:text-foreground md:hover:bg-navy/5";
  return `flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors md:rounded-sm md:border-b-0 ${stateClasses}`;
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Administración" className="border-b border-line md:border-b-0">
      <p className="hidden px-3 pb-2 text-sm font-semibold text-foreground md:block">Administración</p>
      <ul className="-mb-px flex gap-1 overflow-x-auto md:mb-0 md:flex-col">
        {adminNavItems.map(({ href, label, Icon }) => {
          const isActive = isNavItemActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={buildNavLinkClasses(isActive)}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
