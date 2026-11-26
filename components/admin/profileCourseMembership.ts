import type { CourseMemberRole } from "@/lib/admin/admin-queries";
import {
  assignTeacher,
  enrollStudent,
  removeEnrollment,
  removeTeacher,
} from "@/lib/admin/course-actions";
import type { FormState } from "@/lib/forms/form-state";

type AdminFormAction = (previousState: FormState, formData: FormData) => Promise<FormState>;

export interface ProfileCourseMembershipSettings {
  memberFieldName: "teacherId" | "studentId";
  assignAction: AdminFormAction;
  removeAction: AdminFormAction;
  description: string;
  selectLabel: string;
  submitLabel: string;
  emptyAssignedMessage: string;
  noCoursesLeftMessage: string;
}

export const profileCourseMembershipSettings: Record<CourseMemberRole, ProfileCourseMembershipSettings> = {
  docente: {
    memberFieldName: "teacherId",
    assignAction: assignTeacher,
    removeAction: removeTeacher,
    description: "Cursos donde da clases. Puede editar su contenido y ver a sus alumnos.",
    selectLabel: "Asignar a un curso",
    submitLabel: "Asignar curso",
    emptyAssignedMessage: "Todavía no tiene cursos asignados. Elegí uno de la lista de abajo.",
    noCoursesLeftMessage: "No quedan cursos para asignar. Si falta alguno, crealo desde Cursos.",
  },
  alumno: {
    memberFieldName: "studentId",
    assignAction: enrollStudent,
    removeAction: removeEnrollment,
    description: "Cursos en los que está inscripto.",
    selectLabel: "Inscribir en un curso",
    submitLabel: "Inscribir",
    emptyAssignedMessage: "Todavía no está inscripto en ningún curso. Elegí uno de la lista de abajo.",
    noCoursesLeftMessage: "No quedan cursos para inscribirlo. Si falta alguno, crealo desde Cursos.",
  },
};
