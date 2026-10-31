import type { Download } from "@/data/schemas";
import { DownloadIcon, FileIcon } from "@/components/ui/icons";

export function SummaryDownload({ document }: { document: Download }) {
  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        Material de la clase
      </h2>
      <a
        href={document.path}
        download
        className="group mt-6 flex items-center justify-between gap-4 border border-line bg-surface p-6 transition-colors hover:border-navy"
      >
        <span className="flex items-center gap-4">
          <FileIcon className="h-6 w-6 text-primary" />
          <span className="font-medium text-foreground">{document.label}</span>
        </span>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <DownloadIcon className="h-4 w-4" />
          Descargar
        </span>
      </a>
    </div>
  );
}
