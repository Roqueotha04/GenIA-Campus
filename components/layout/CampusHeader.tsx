import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GridIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/Logo";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ADMIN_PATH } from "@/lib/admin/admin-paths";
import { signOut } from "@/lib/auth/auth-actions";
import type { CurrentProfile } from "@/lib/auth/current-profile";
import { CAMPUS_PATH, LOGIN_PATH, roleLabels } from "@/lib/auth/roles";

function AdminPanelLink() {
  return (
    <Button href={ADMIN_PATH} variant="inverse" size="sm">
      <GridIcon className="h-4 w-4" />
      <span className="sr-only sm:not-sr-only">Administración</span>
    </Button>
  );
}

function ProfileIdentity({ profile }: { profile: CurrentProfile }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {!profile.isGuest && (
        <span className="hidden max-w-48 truncate text-white/85 md:inline">{profile.full_name}</span>
      )}
      <span className="rounded-sm border border-cyan/40 px-2 py-0.5 text-xs font-medium text-cyan">
        {profile.isGuest ? "Invitado" : roleLabels[profile.role]}
      </span>
    </div>
  );
}

function SessionAction({ isGuest }: { isGuest: boolean }) {
  if (isGuest) {
    return (
      <Button href={LOGIN_PATH} variant="outlineOnDark" size="sm">
        Ingresar
      </Button>
    );
  }

  return (
    <form action={signOut}>
      <SubmitButton variant="outlineOnDark" size="sm" pendingLabel="Saliendo…">
        Salir
      </SubmitButton>
    </form>
  );
}

export function CampusHeader({ profile }: { profile: CurrentProfile }) {
  const isAdmin = !profile.isGuest && profile.role === "admin";

  return (
    <header className="surface-dark border-b border-white/10 bg-navy text-white">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 md:px-8">
        <Link href={CAMPUS_PATH} aria-label="Campus Generación IA, inicio" className="shrink-0">
          <Logo className="h-5 md:h-6" />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {isAdmin && <AdminPanelLink />}
          <ProfileIdentity profile={profile} />
          <SessionAction isGuest={profile.isGuest} />
        </div>
      </div>
    </header>
  );
}
