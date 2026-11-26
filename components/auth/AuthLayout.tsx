import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Isotype } from "@/components/ui/Isotype";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[0.8fr_1.2fr]">
      <section className="surface-dark flex flex-col justify-between gap-8 bg-navy px-6 py-6 text-white md:px-10 lg:py-10">
        <Link href="/" aria-label="Generación IA, inicio">
          <Logo className="h-5 md:h-6" />
        </Link>
        <div>
          <p className="text-sm text-cyan">Campus virtual</p>
          <p className="mt-2 font-heading text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
            Volvé a tus clases y seguí aprendiendo.
          </p>
        </div>
      </section>
      <section className="flex items-center px-6 py-10 md:px-10">
        <div className="mx-auto w-full max-w-sm">
          <Isotype className="h-10 w-10 text-xl" />
          <h1 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted">{description}</p>
          <div className="mt-6">{children}</div>
        </div>
      </section>
    </main>
  );
}
