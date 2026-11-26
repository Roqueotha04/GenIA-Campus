import "server-only";
import type { ManagedAssignment } from "@/lib/assignments/assignment-types";
import { loadManagedAssignments } from "@/lib/assignments/load-managed-assignments";
import type { CourseSummary } from "@/lib/courses/course-access";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import type { TableRow } from "@/types/database";

export type ManagedResource = Pick<
  TableRow<"resources">,
  "id" | "kind" | "title" | "url" | "game_slug" | "mime_type" | "size_bytes" | "position"
>;

export type ManagedSection = Pick<TableRow<"sections">, "id" | "title" | "description" | "position"> & {
  resources: ManagedResource[];
  assignments: ManagedAssignment[];
};

export type ManagedNotice = Pick<TableRow<"notices">, "id" | "title" | "body" | "created_at">;

export interface CourseManagementData {
  enrollmentKey: string;
  sections: ManagedSection[];
  notices: ManagedNotice[];
}

export async function loadCourseManagement(course: CourseSummary): Promise<CourseManagementData> {
  const supabase = await createSupabaseServerClient();

  const [{ data: enrollmentKey }, { data: sections }, { data: resources }, { data: notices }, assignments] =
    await Promise.all([
      supabase.rpc("course_enrollment_key", { target_course_id: course.id }),
      supabase
        .from("sections")
        .select("id, title, description, position")
        .eq("course_id", course.id)
        .order("position")
        .order("created_at"),
      supabase
        .from("resources")
        .select("id, section_id, kind, title, url, game_slug, mime_type, size_bytes, position")
        .eq("course_id", course.id)
        .order("position")
        .order("created_at"),
      supabase
        .from("notices")
        .select("id, title, body, created_at")
        .eq("course_id", course.id)
        .order("created_at", { ascending: false }),
      loadManagedAssignments(course),
    ]);

  return {
    enrollmentKey: enrollmentKey ?? "",
    sections: (sections ?? []).map((section) => ({
      ...section,
      resources: (resources ?? [])
        .filter((resource) => resource.section_id === section.id)
        .map((resource) => ({
          id: resource.id,
          kind: resource.kind,
          title: resource.title,
          url: resource.url,
          game_slug: resource.game_slug,
          mime_type: resource.mime_type,
          size_bytes: resource.size_bytes,
          position: resource.position,
        })),
      assignments: assignments.filter((assignment) => assignment.section_id === section.id),
    })),
    notices: notices ?? [],
  };
}
