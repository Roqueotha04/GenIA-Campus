import type { ComponentType } from "react";
import { AssignmentCreateForm } from "@/components/assignments/AssignmentCreateForm";
import { ForumResourceForm } from "@/components/forums/ForumResourceForm";
import { AssignmentIcon, FileIcon, ForumIcon, QuizIcon } from "@/components/ui/icons";
import { FileResourceForm } from "./FileResourceForm";
import { QuizActivityForm } from "./QuizActivityForm";

export interface ResourceCreatorFormProps {
  sectionId: string;
  onCreated?: () => void;
}

export interface ResourceCreator {
  id: string;
  label: string;
  description: string;
  Icon: ComponentType<{ className?: string }>;
  Form: ComponentType<ResourceCreatorFormProps>;
}

export const resourceCreators: ResourceCreator[] = [
  {
    id: "file",
    label: "Archivo",
    description: "Un documento, presentación o imagen para descargar.",
    Icon: FileIcon,
    Form: FileResourceForm,
  },
  {
    id: "forum",
    label: "Foro",
    description: "Un espacio para que el curso abra temas y responda.",
    Icon: ForumIcon,
    Form: ForumResourceForm,
  },
  {
    id: "assignment",
    label: "Tarea",
    description: "Una consigna con fecha para que los alumnos entreguen.",
    Icon: AssignmentIcon,
    Form: AssignmentCreateForm,
  },
  {
    id: "quiz",
    label: "Cuestionario",
    description: "Preguntas que se corrigen solas al terminar.",
    Icon: QuizIcon,
    Form: QuizActivityForm,
  },
];
