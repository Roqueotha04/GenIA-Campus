import { Logo } from "@/components/ui/Logo";

export function SessionLoading() {
  return (
    <div className="surface-dark flex min-h-screen flex-col items-center justify-center gap-6 bg-navy">
      <Logo className="h-6" />
      <p role="status" className="text-sm text-white/60">
        Verificando tu sesión…
      </p>
    </div>
  );
}
