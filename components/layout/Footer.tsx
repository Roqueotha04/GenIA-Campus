import { Logo } from "@/components/ui/Logo";
import { InstagramIcon } from "@/components/ui/icons";

export function Footer() {
  return (
    <footer className="surface-dark bg-navy-deep text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <Logo className="h-6" />
          <p className="mt-4 font-accent text-xl italic text-cyan">
            Formando creadores del futuro
          </p>
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
