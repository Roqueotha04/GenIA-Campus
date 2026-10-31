"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { ActionButton } from "@/components/ui/Button";
import { useSession } from "@/hooks/useSession";

const roleLabels = { alumno: "Alumno", docente: "Docente" };

export function CampusHeader() {
  const router = useRouter();
  const { user, signOut } = useSession();

  const handleSignOut = () => {
    signOut();
    router.replace("/");
  };

  return (
    <header className="surface-dark border-b border-white/10 bg-navy text-white">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-4 px-6 md:px-8">
        <Link href="/campus" aria-label="Campus Generación IA, inicio">
          <Logo className="h-6 md:h-7" />
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-sm">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-cyan" />
              <span className="hidden text-white/80 sm:inline">{user.name}</span>
              <span className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-cyan">
                {roleLabels[user.role]}
              </span>
            </div>
            <ActionButton variant="outlineOnDark" size="sm" onClick={handleSignOut}>
              Salir
            </ActionButton>
          </div>
        )}
      </div>
    </header>
  );
}
