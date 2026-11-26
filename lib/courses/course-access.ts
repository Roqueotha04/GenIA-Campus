import "server-only";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import type { CurrentProfile } from "@/lib/auth/current-profile";
import type { TableRow } from "@/types/database";

export type CourseSummary = Omit<TableRow<"courses">, "enrollment_key">;

export interface CourseAccess {
  canManage: boolean;
  canView: boolean;
  isEnrolled: boolean;
}

export const COURSE_SUMMARY_COLUMNS =
  "id, level_slug, module_number, title, description, is_published, created_at";

export const findCourseByModule = cache(
  async (levelSlug: string, rawModuleNumber: string): Promise<CourseSummary | null> => {
    const moduleNumber = Number(rawModuleNumber);
    if (!Number.isInteger(moduleNumber) || moduleNumber < 1) return null;

    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("courses")
      .select(COURSE_SUMMARY_COLUMNS)
      .eq("level_slug", levelSlug)
      .eq("module_number", moduleNumber)
      .maybeSingle();

    return data;
  },
);

export const getCourseAccess = cache(
  async (courseId: string, profile: CurrentProfile): Promise<CourseAccess> => {
    if (profile.role === "admin") return { canManage: true, canView: true, isEnrolled: false };

    const supabase = await createSupabaseServerClient();
    const [{ data: teaches }, { data: isEnrolled }] = await Promise.all([
      supabase.rpc("teaches", { target_course_id: courseId }),
      supabase.rpc("is_enrolled", { target_course_id: courseId }),
    ]);

    const canManage = Boolean(teaches);
    const enrolled = Boolean(isEnrolled);
    return { canManage, canView: canManage || enrolled, isEnrolled: enrolled };
  },
);

export function buildCourseHref(course: Pick<CourseSummary, "level_slug" | "module_number">): string {
  return `/campus/${course.level_slug}/${course.module_number}`;
}
