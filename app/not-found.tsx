import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="surface-dark flex min-h-screen flex-col items-start justify-center bg-navy px-6 text-white md:px-16">
      <p className="text-sm font-medium text-cyan">Error 404</p>
      <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight md:text-4xl">
        Esta página no existe o cambió de lugar
      </h1>
      <div className="mt-6">
        <Button href="/" variant="inverse">
          Volver al inicio
        </Button>
      </div>
    </main>
  );
}
