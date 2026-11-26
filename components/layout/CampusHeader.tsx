import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { signOut } from "@/lib/auth/auth-actions";
import type { CurrentProfile } from "@/lib/auth/current-profile";
import { roleLabels } from "@/lib/auth/roles";

const ADMIN_PANEL_PATH = "/campus/admin";

export function CampusHeader({ profile }: { profile: CurrentProfile }) {
  return (
    <header className="surface-dark border-b border-white/10 bg-navy text-white">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-4 px-6 md:px-8">
        <Link href="/campus" aria-label="Campus Generación IA, inicio">
          <Logo className="h-6 md:h-7" />
        </Link>
        <div className="flex items-center gap-4">
          {profile.role === "admin" && (
            <Link
              href={ADMIN_PANEL_PATH}
              className="text-sm text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Administración
            </Link>
          )}
          <div className="flex items-center gap-3 text-sm">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-cyan" />
            <span className="hidden text-white/80 sm:inline">{profile.full_name}</span>
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-cyan">
              {roleLabels[profile.role]}
            </span>
          </div>
          <form action={signOut}>
            <SubmitButton variant="outlineOnDark" size="sm" pendingLabel="Saliendo…">
              Salir
            </SubmitButton>
          </form>
        </div>
      </div>
    </header>
  );
}
