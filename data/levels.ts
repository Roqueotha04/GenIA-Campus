import { levelSchema } from "./schemas";
import { quizAutomatizacionesAdultos } from "./quiz-automatizaciones-adultos";
import { quizIaAdultos } from "./quiz-ia-adultos";

function emptyModules(count: number) {
  return Array.from({ length: count }, (_, index) => ({ number: index + 1 }));
}

function emptyModulesAfterFirst(count: number) {
  return emptyModules(count).slice(1);
}

export const levels = levelSchema.array().parse([
  {
    slug: "nivel-1",
    name: "Nivel 1",
    description: "Los primeros pasos para entender y crear con inteligencia artificial.",
    accent: "level-1",
    modules: emptyModules(5),
  },
  {
    slug: "nivel-2",
    name: "Nivel 2",
    description: "Proyectos más complejos, con herramientas y lógica de programación.",
    accent: "level-2",
    modules: emptyModules(5),
  },
  {
    slug: "nivel-3",
    name: "Nivel 3",
    description: "Ideas propias convertidas en proyectos completos de tecnología.",
    accent: "level-3",
    modules: [
      {
        number: 1,
        classes: [
          {
            number: 1,
            title: "Las tres preguntas",
            summary:
              "Un juego para clasificar casos reales: ¿tiene cuerpo?, ¿sigue reglas? ¿o aprende de datos? Descubrí qué es un robot, qué es un programa y qué es una IA.",
            game: {
              title: "Las tres preguntas",
              path: "/juegos/las-tres-preguntas.html",
            },
          },
        ],
      },
      ...emptyModulesAfterFirst(5),
    ],
  },
  {
    slug: "adultos",
    name: "Adultos",
    description: "Inteligencia artificial aplicada a tu trabajo y a tu día a día.",
    accent: "level-4",
    modules: [
      {
        number: 1,
        generalDocuments: [
          {
            label: "Planificación del curso",
            path: "/material/adultos-modulo-1-planificacion.pdf",
          },
        ],
        presentations: [
          {
            label: "Presentación del curso",
            path: "/material/adultos-modulo-1-presentacion-del-curso.pdf",
          },
        ],
        classes: [
          {
            number: 1,
            title: "Introducción a la IA",
            summary:
              "Qué es la inteligencia artificial, cómo aprende a partir de datos, en qué se diferencia del software tradicional y por qué creció tan rápido.",
            presentationPdf: "/material/adultos-modulo-1-clase-1-presentacion.pdf",
            summaryDocument: {
              label: "Resumen de la clase",
              path: "/material/adultos-modulo-1-clase-1-resumen.docx",
            },
            activity: quizIaAdultos,
          },
        ],
      },
      {
        number: 2,
        presentations: [
          {
            label: "Presentación del curso",
            path: "/material/adultos-modulo-2-presentacion-del-curso.pdf",
          },
        ],
        classes: [
          {
            number: 1,
            title: "Introducción a la automatización",
            summary:
              "Qué es un flujo de automatización, cuáles son sus componentes (disparadores, acciones y resultados), cómo se combinan con la IA y en qué se diferencian de la programación tradicional.",
            presentationPdf: "/material/adultos-modulo-2-clase-1-presentacion.pdf",
            summaryDocument: {
              label: "Resumen de la clase",
              path: "/material/adultos-modulo-2-clase-1-resumen.docx",
            },
            assignmentDocument: {
              label: "TP Clase 1 - Primer escenario",
              path: "/material/adultos-modulo-2-clase-1-tp.pdf",
            },
            activity: quizAutomatizacionesAdultos,
          },
        ],
      },
    ],
  },
]);
