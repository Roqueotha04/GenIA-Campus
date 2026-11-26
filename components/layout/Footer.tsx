import { Logo } from "@/components/ui/Logo";
import { InstagramIcon } from "@/components/ui/icons";

type FooterVariant = "compact" | "editorial";

interface FooterProps {
  variant?: FooterVariant;
}

const footerVariantClasses: Record<FooterVariant, { container: string; logo: string; tagline: string }> = {
  compact: {
    container: "gap-6 py-8",
    logo: "h-5",
    tagline: "mt-3 text-sm text-cyan",
  },
  editorial: {
    container: "gap-8 py-12",
    logo: "h-6",
    tagline: "mt-4 font-accent text-xl italic text-cyan",
  },
};

export function Footer({ variant = "editorial" }: FooterProps) {
  const styles = footerVariantClasses[variant];

  return (
    <footer className="surface-dark bg-navy-deep text-white">
      <div
        className={`mx-auto flex w-full max-w-6xl flex-col px-6 md:flex-row md:items-end md:justify-between md:px-8 ${styles.container}`}
      >
        <div>
          <Logo className={styles.logo} />
          <p className={styles.tagline}>Formando creadores del futuro</p>
          <p className="mt-3 text-sm text-white/60">Córdoba 1310, Mar del Plata</p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-white/70">
          <a
            href="https://www.instagram.com/generacionia.ar/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-white"
          >
            <InstagramIcon className="h-4 w-4" />
            generacionia.ar
          </a>
          <a
            href="https://www.institutogeneracionia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            institutogeneracionia.com
          </a>
        </div>
      </div>
    </footer>
  );
}
