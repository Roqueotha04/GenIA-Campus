"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Isotype } from "@/components/ui/Isotype";
import { useHydrated } from "@/hooks/useHydrated";
import { useSession } from "@/hooks/useSession";
import { LoginForm } from "./LoginForm";

export function LoginView() {
  const router = useRouter();
  const hydrated = useHydrated();
  const { user } = useSession();

  useEffect(() => {
    if (hydrated && user) router.replace("/campus");
  }, [hydrated, user, router]);

  return (
    <main className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
      <section className="surface-dark flex flex-col justify-between gap-16 bg-navy px-6 py-10 text-white md:px-12 lg:py-14">
        <Link href="/" aria-label="Generación IA, inicio">
          <Logo className="h-6 md:h-7" />
        </Link>
        <div>
          <div className="text-cyan">
            <Eyebrow>Campus virtual</Eyebrow>
          </div>
          <p className="mt-6 font-heading text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Volvé a tus clases
            <span className="mt-2 block font-accent text-3xl font-normal italic text-cyan md:text-4xl">
              y seguí aprendiendo.
            </span>
          </p>
        </div>
      </section>
      <section className="flex items-center px-6 py-14 md:px-12">
        <div className="mx-auto w-full max-w-md">
          <Isotype />
          <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Acceder al campus
          </h1>
          <p className="mt-3 text-base text-muted">
            Ingresá con tu email y tu clave.
          </p>
          <div className="mt-10">
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
