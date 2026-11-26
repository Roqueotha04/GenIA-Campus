import Link from "next/link";
import { buildAdminCoursePath } from "@/lib/admin/admin-paths";
import type { CourseWithCounts } from "@/lib/admin/admin-queries";
import { describeCourseModule } from "@/lib/admin/course-options";
import { ActiveStatus } from "./ActiveStatus";
import { AdminEmptyState } from "./AdminEmptyState";
import { AdminTable } from "./AdminTable";

const courseTableColumns = ["Curso", "Nivel y módulo", "Estado", "Docentes", "Alumnos"];

function CoursePublicationStatus({ isPublished }: { isPublished: boolean }) {
  return <ActiveStatus isActive={isPublished} activeLabel="Publicado" inactiveLabel="Borrador" />;
}

function CourseCard({ course }: { course: CourseWithCounts }) {
  return (
    <li>
      <Link
        href={buildAdminCoursePath(course.id)}
        className="block rounded-sm border border-line bg-surface p-3 transition-colors hover:border-navy"
      >
        <p className="font-medium text-foreground">{course.title}</p>
        <p className="mt-0.5 text-sm text-muted">
          {describeCourseModule(course.level_slug, course.module_number)}
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
          <CoursePublicationStatus isPublished={course.is_published} />
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
    <tr className="relative transition-colors hover:bg-background">
      <td className="px-4 py-2.5 font-medium text-foreground">
        <Link
          href={buildAdminCoursePath(course.id)}
          className="after:absolute after:inset-0 hover:text-primary"
        >
          {course.title}
        </Link>
      </td>
      <td className="px-4 py-2.5 text-muted">
        {describeCourseModule(course.level_slug, course.module_number)}
      </td>
      <td className="px-4 py-2.5">
        <CoursePublicationStatus isPublished={course.is_published} />
      </td>
      <td className="px-4 py-2.5 text-foreground">{course.teacherCount}</td>
      <td className="px-4 py-2.5 text-foreground">{course.studentCount}</td>
    </tr>
  );
}

export function CourseList({ courses }: { courses: CourseWithCounts[] }) {
  if (courses.length === 0) {
    return (
      <AdminEmptyState message="Todavía no hay cursos creados. Creá el primero con «Nuevo curso»." />
    );
  }

  return (
    <>
      <ul className="space-y-2 md:hidden">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </ul>
      <AdminTable columns={courseTableColumns}>
        {courses.map((course) => (
          <CourseRow key={course.id} course={course} />
        ))}
      </AdminTable>
    </>
  );
}
