import type { CourseClass, CourseModule, Level } from "@/data/schemas";
import { buildModuleHref, formatNumber } from "@/lib/catalog";

export type ResourceKind = "general" | "notices" | "activity" | "game" | "assignment" | "presentation" | "summary";

export type ModuleSectionId = "general" | "activities" | "presentations" | "summaries";

export interface ModuleResource {
  kind: ResourceKind;
  label: string;
  href: string;
  isDownload: boolean;
}

export interface ModuleSection {
  id: ModuleSectionId;
  title: string;
  emptyMessage: string;
  resources: ModuleResource[];
}

function buildClassLabel(courseClass: CourseClass): string {
  return `Clase ${formatNumber(courseClass.number)} · ${courseClass.title}`;
}

function listGeneralResources(courseModule: CourseModule, moduleHref: string): ModuleResource[] {
  const documents: ModuleResource[] = (courseModule.generalDocuments ?? []).map((document) => ({
    kind: "general",
    label: document.label,
    href: document.path,
    isDownload: true,
  }));
  const noticesLink: ModuleResource = {
    kind: "notices",
    label: "Avisos",
    href: `${moduleHref}/avisos`,
    isDownload: false,
  };
  return [...documents, noticesLink];
}

function listActivityResources(moduleHref: string, classes: CourseClass[]): ModuleResource[] {
  return classes.flatMap((courseClass) => {
    const classHref = `${moduleHref}/${courseClass.number}`;
    const resources: ModuleResource[] = [];
    if (courseClass.activity) {
      resources.push({
        kind: "activity",
        label: courseClass.activity.title,
        href: `${classHref}/actividad`,
        isDownload: false,
      });
    }
    if (courseClass.game) {
      resources.push({
        kind: "game",
        label: courseClass.game.title,
        href: `${classHref}/juego`,
        isDownload: false,
      });
    }
    if (courseClass.assignmentDocument) {
      resources.push({
        kind: "assignment",
        label: courseClass.assignmentDocument.label,
        href: courseClass.assignmentDocument.path,
        isDownload: true,
      });
    }
    return resources;
  });
}

function listPresentationResources(
  courseModule: CourseModule,
  classes: CourseClass[],
): ModuleResource[] {
  const modulePresentations: ModuleResource[] = (courseModule.presentations ?? []).map(
    (document) => ({
      kind: "presentation",
      label: document.label,
      href: document.path,
      isDownload: true,
    }),
  );
  const classPresentations = classes.flatMap((courseClass) =>
    courseClass.presentationPdf
      ? [
          {
            kind: "presentation" as const,
            label: buildClassLabel(courseClass),
            href: courseClass.presentationPdf,
            isDownload: true,
          },
        ]
      : [],
  );
  return [...modulePresentations, ...classPresentations];
}

function listSummaryResources(classes: CourseClass[]): ModuleResource[] {
  return classes.flatMap((courseClass) =>
    courseClass.summaryDocument
      ? [
          {
            kind: "summary" as const,
            label: buildClassLabel(courseClass),
            href: courseClass.summaryDocument.path,
            isDownload: true,
          },
        ]
      : [],
  );
}

export function buildModuleSections(level: Level, courseModule: CourseModule): ModuleSection[] {
  const classes = courseModule.classes ?? [];
  const moduleHref = buildModuleHref(level, courseModule);

  return [
    {
      id: "general",
      title: "General",
      emptyMessage: "Todavía no hay documentos generales.",
      resources: listGeneralResources(courseModule, moduleHref),
    },
    {
      id: "activities",
      title: "Actividades",
      emptyMessage: "Todavía no hay actividades. Aparecen cuando el docente las cargue.",
      resources: listActivityResources(moduleHref, classes),
    },
    {
      id: "presentations",
      title: "Presentaciones",
      emptyMessage: "Todavía no hay presentaciones. Aparecen cuando el docente las cargue.",
      resources: listPresentationResources(courseModule, classes),
    },
    {
      id: "summaries",
      title: "Resúmenes",
      emptyMessage: "Todavía no hay resúmenes. Aparecen cuando el docente los cargue.",
      resources: listSummaryResources(classes),
    },
  ];
}
