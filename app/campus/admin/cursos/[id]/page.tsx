import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminDetailLayout } from "@/components/admin/AdminDetailLayout";
import { AdminPage } from "@/components/admin/AdminPage";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { ConfirmActionForm } from "@/components/admin/ConfirmActionForm";
import { CourseEditForm } from "@/components/admin/CourseEditForm";
import { CourseKeyPanel } from "@/components/admin/CourseKeyPanel";
import { CourseMemberList } from "@/components/admin/CourseMemberList";
import { CourseProfileAssignForm } from "@/components/admin/CourseProfileAssignForm";
import { Button } from "@/components/ui/Button";
import { ADMIN_COURSES_PATH } from "@/lib/admin/admin-paths";
import { courseIdSchema } from "@/lib/admin/admin-schemas";
import { findCourseDetail, listAssignableProfiles } from "@/lib/admin/admin-queries";
import {
  assignTeacher,
  deleteCourse,
  enrollStudent,
  removeEnrollment,
  removeTeacher,
} from "@/lib/admin/course-actions";
import { describeCourseModule } from "@/lib/admin/course-options";
import { buildCourseHref } from "@/lib/courses/course-access";

export const metadata: Metadata = { title: "Gestionar curso" };

interface AdminCoursePageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCoursePage({ params }: AdminCoursePageProps) {
  const { id } = await params;

  const parsedId = courseIdSchema.safeParse({ id });
  if (!parsedId.success) notFound();

  const detail = await findCourseDetail(parsedId.data.id);
  if (!detail) notFound();

  const { course, enrollmentKey, teachers, students } = detail;
  const [assignableTeachers, enrollableStudents] = await Promise.all([
    listAssignableProfiles("docente", teachers.map((teacher) => teacher.id)),
    listAssignableProfiles("alumno", students.map((student) => student.id)),
  ]);

  return (
    <AdminPage
      backLink={{ href: ADMIN_COURSES_PATH, label: "Cursos" }}
      title={course.title}
      subtitle={describeCourseModule(course.level_slug, course.module_number)}
      actions={
        <Button href={buildCourseHref(course)} variant="outline" size="sm">
          Ver curso
        </Button>
      }
    >
      <AdminDetailLayout
        aside={
          <>
            <AdminPanel
              title="Clave de inscripción"
              description="Los alumnos la usan para inscribirse solos. Si la regenerás, la anterior deja de servir."
            >
              <CourseKeyPanel courseId={course.id} enrollmentKey={enrollmentKey} />
            </AdminPanel>
            <AdminPanel
              title="Eliminar curso"
              description="Borra el curso con sus inscripciones, docentes asignados y contenido. No se puede deshacer."
            >
              <ConfirmActionForm
                action={deleteCourse}
                hiddenFields={{ id: course.id }}
                label="Eliminar curso"
                confirmLabel="Confirmar eliminación"
                pendingLabel="Eliminando..."
              />
            </AdminPanel>
          </>
        }
      >
        <AdminPanel title="Datos del curso">
          <CourseEditForm course={course} />
        </AdminPanel>
        <AdminPanel title="Docentes" description="Pueden editar el contenido del curso y ver a sus alumnos.">
          <div className="space-y-4">
            <CourseMemberList
              members={teachers}
              courseId={course.id}
              memberFieldName="teacherId"
              removeAction={removeTeacher}
              removeLabel="Quitar"
              emptyMessage="Todavía no hay docentes asignados. Elegí uno de la lista de abajo."
            />
            <CourseProfileAssignForm
              action={assignTeacher}
              courseId={course.id}
              fieldName="teacherId"
              fieldLabel="Asignar docente"
              placeholder="Elegí un docente"
              submitLabel="Asignar docente"
              emptyMessage="No quedan docentes activos para asignar. Creá un usuario con rol Docente desde Usuarios."
              candidates={assignableTeachers}
            />
          </div>
        </AdminPanel>
        <AdminPanel title="Alumnos inscriptos" description="Se inscriben con la clave o los sumás vos desde acá.">
          <div className="space-y-4">
            <CourseMemberList
              members={students}
              courseId={course.id}
              memberFieldName="studentId"
              removeAction={removeEnrollment}
              removeLabel="Quitar"
              emptyMessage="Todavía no hay alumnos inscriptos. Compartí la clave o inscribí uno desde la lista de abajo."
            />
            <CourseProfileAssignForm
              action={enrollStudent}
              courseId={course.id}
              fieldName="studentId"
              fieldLabel="Inscribir alumno"
              placeholder="Elegí un alumno"
              submitLabel="Inscribir alumno"
              emptyMessage="No quedan alumnos activos para inscribir. Creá un usuario con rol Alumno desde Usuarios."
              candidates={enrollableStudents}
            />
          </div>
        </AdminPanel>
      </AdminDetailLayout>
    </AdminPage>
  );
}
