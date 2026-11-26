import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AssignmentDetailView } from "@/components/assignments/AssignmentDetailView";
import { GuestSubmissionNotice } from "@/components/assignments/GuestSubmissionNotice";
import { StudentSubmissionPanel } from "@/components/assignments/StudentSubmissionPanel";
import { TeacherSubmissionsPanel } from "@/components/assignments/TeacherSubmissionsPanel";
import { requireProfile } from "@/lib/auth/current-profile";
import {
  findAttachmentUrl,
  findCourseAssignment,
  findStudentSubmission,
  loadRoster,
} from "@/lib/assignments/assignment-queries";
import { findLevel } from "@/lib/catalog";
import { buildCourseHref, findCourseByModule, getCourseAccess } from "@/lib/courses/course-access";

interface AssignmentPageProps {
  params: Promise<{ nivel: string; modulo: string; id: string }>;
}

export const metadata: Metadata = { title: "Entrega" };

export default async function AssignmentPage({ params }: AssignmentPageProps) {
  const { nivel, modulo, id } = await params;

  const course = await findCourseByModule(nivel, modulo);
  if (!course) notFound();

  const profile = await requireProfile();
  const { canManage, canView } = await getCourseAccess(course.id, profile);
  if (!canView) redirect(buildCourseHref(course));

  const assignment = await findCourseAssignment(course.id, id);
  if (!assignment) notFound();

  const attachmentUrl = await findAttachmentUrl(assignment);
  const levelName = findLevel(nivel)?.name ?? course.level_slug;

  return (
    <AssignmentDetailView
      course={course}
      levelName={levelName}
      assignment={assignment}
      attachmentUrl={attachmentUrl}
    >
      {canManage ? (
        <TeacherSubmissionsPanel assignment={assignment} roster={await loadRoster(course.id, assignment.id)} />
      ) : profile.isGuest ? (
        <GuestSubmissionNotice />
      ) : (
        <StudentSubmissionPanel
          assignment={assignment}
          submission={await findStudentSubmission(assignment.id, profile.id)}
        />
      )}
    </AssignmentDetailView>
  );
}
