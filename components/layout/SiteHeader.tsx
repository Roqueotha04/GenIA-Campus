import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

export function SiteHeader() {
  return (
    <header className="surface-dark border-b border-white/10 bg-navy">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6 md:px-8">
        <Link href="/" aria-label="Generación IA, inicio">
          <Logo className="h-6 md:h-7" />
        </Link>
        <Button href="/acceso" variant="inverse" size="sm">
          Acceder
        </Button>
      </div>
    </header>
  );
}
