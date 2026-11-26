import type { ComponentType } from "react";
import { QuizResourceForm } from "@/components/quizzes/QuizResourceForm";
import { FileResourceForm } from "./FileResourceForm";
import { GameResourceForm } from "./GameResourceForm";
import { LinkResourceForm } from "./LinkResourceForm";

export interface ResourceCreator {
  id: string;
  label: string;
  Form: ComponentType<{ sectionId: string }>;
}

export const resourceCreators: ResourceCreator[] = [
  { id: "file", label: "Archivo", Form: FileResourceForm },
  { id: "link", label: "Enlace", Form: LinkResourceForm },
  { id: "game", label: "Juego", Form: GameResourceForm },
  { id: "quiz", label: "Cuestionario", Form: QuizResourceForm },
];
