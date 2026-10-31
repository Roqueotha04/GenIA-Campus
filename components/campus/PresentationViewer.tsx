import { DownloadIcon } from "@/components/ui/icons";

export function PresentationViewer({ pdfPath }: { pdfPath: string }) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Presentación
        </h2>
        <a
          href={pdfPath}
          download
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-navy"
        >
          <DownloadIcon className="h-4 w-4" />
          Descargar PDF
        </a>
      </div>
      <iframe
        src={pdfPath}
        title="Presentación de la clase"
        className="mt-6 h-[70vh] w-full border border-line bg-surface"
      />
    </div>
  );
}
