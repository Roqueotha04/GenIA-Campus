import Link from "next/link";
import { buildAdminCoursePath } from "@/lib/admin/admin-paths";
import type { CourseWithCounts } from "@/lib/admin/admin-queries";
import { describeCourseModule } from "@/lib/admin/course-options";
import { ActiveStatus } from "./ActiveStatus";
import { AdminEmptyState } from "./AdminEmptyState";

function CourseCard({ course }: { course: CourseWithCounts }) {
  return (
    <li>
      <Link
        href={buildAdminCoursePath(course.id)}
        className="block rounded-sm border border-line bg-surface p-4 transition-colors hover:border-navy"
      >
        <p className="font-medium text-foreground">{course.title}</p>
        <p className="mt-1 text-sm text-muted">
          {describeCourseModule(course.level_slug, course.module_number)}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
          <ActiveStatus isActive={course.is_published} activeLabel="Publicado" inactiveLabel="Borrador" />
          <span>
            {course.teacherCount} docentes · {course.studentCount} alumnos
          </span>
        </div>
      </Link>
    </li>
  );
}

function CourseRow({ course }: { course: CourseWithCounts }) {
  return (
    <tr className="border-t border-line">
      <td className="px-4 py-3 font-medium text-foreground">{course.title}</td>
      <td className="px-4 py-3 text-muted">
        {describeCourseModule(course.level_slug, course.module_number)}
      </td>
      <td className="px-4 py-3">
        <ActiveStatus isActive={course.is_published} activeLabel="Publicado" inactiveLabel="Borrador" />
      </td>
      <td className="px-4 py-3 text-foreground">{course.teacherCount}</td>
      <td className="px-4 py-3 text-foreground">{course.studentCount}</td>
      <td className="px-4 py-3 text-right">
        <Link
          href={buildAdminCoursePath(course.id)}
          className="text-sm font-semibold text-primary hover:text-navy"
        >
          Gestionar
        </Link>
      </td>
    </tr>
  );
}

function CourseTable({ courses }: { courses: CourseWithCounts[] }) {
  return (
    <div className="hidden overflow-x-auto rounded-sm border border-line bg-surface md:block">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-[0.18em] text-muted">
            <th scope="col" className="px-4 py-3 font-medium">Título</th>
            <th scope="col" className="px-4 py-3 font-medium">Nivel y módulo</th>
            <th scope="col" className="px-4 py-3 font-medium">Estado</th>
            <th scope="col" className="px-4 py-3 font-medium">Docentes</th>
            <th scope="col" className="px-4 py-3 font-medium">Alumnos</th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <CourseRow key={course.id} course={course} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CourseList({ courses }: { courses: CourseWithCounts[] }) {
  if (courses.length === 0) {
    return (
      <AdminEmptyState message="Todavía no hay cursos creados. Creá el primero desde el formulario de abajo." />
    );
  }

  return (
    <>
      <ul className="space-y-3 md:hidden">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </ul>
      <CourseTable courses={courses} />
    </>
  );
}
