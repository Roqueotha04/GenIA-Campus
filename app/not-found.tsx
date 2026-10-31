import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function NotFound() {
  return (
    <main className="surface-dark flex min-h-screen flex-col items-start justify-center bg-navy px-6 text-white md:px-16">
      <div className="text-cyan">
        <Eyebrow>Error 404</Eyebrow>
      </div>
      <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight md:text-6xl">
        Esta página no existe
        <span className="mt-3 block font-accent text-3xl font-normal italic text-cyan md:text-5xl">
          o cambió de lugar.
        </span>
      </h1>
      <div className="mt-10">
        <Button href="/" variant="inverse">
          Volver al inicio
        </Button>
      </div>
    </main>
  );
}
