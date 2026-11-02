import Link from "next/link";
import type { ModuleResource } from "@/lib/module-resources";
import { ArrowRightIcon, DownloadIcon } from "@/components/ui/icons";
import { ResourceIcon } from "./ResourceIcon";

const rowClasses = "group flex items-center gap-4 py-4";

function ResourceRowContent({ resource }: { resource: ModuleResource }) {
  const ActionIcon = resource.isDownload ? DownloadIcon : ArrowRightIcon;

  return (
    <>
      <ResourceIcon kind={resource.kind} className="h-6 w-6 shrink-0 text-primary" />
      <span className="flex-1 text-base text-foreground group-hover:text-primary">
        {resource.label}
      </span>
      <span className="hidden text-sm text-muted sm:inline">
        {resource.isDownload ? "Descargar" : "Abrir"}
      </span>
      <ActionIcon className="h-5 w-5 shrink-0 text-muted group-hover:text-primary" />
    </>
  );
}

export function ResourceRow({ resource }: { resource: ModuleResource }) {
  if (resource.isDownload) {
    return (
      <a href={resource.href} download className={rowClasses}>
        <ResourceRowContent resource={resource} />
      </a>
    );
  }

  return (
    <Link href={resource.href} className={rowClasses}>
      <ResourceRowContent resource={resource} />
    </Link>
  );
}
