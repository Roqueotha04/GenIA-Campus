"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { errorState, successState, type FormState } from "@/lib/forms/form-state";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

const enrollmentSchema = z.object({
  courseId: z.uuid(),
  enrollmentKey: z.string().trim().min(1),
});

export async function enrollInCourse(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = enrollmentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState("Ingresá la clave que te dio tu docente.");

  const supabase = await createSupabaseServerClient();
  const { data: wasEnrolled, error } = await supabase.rpc("enroll_with_key", {
    target_course_id: parsed.data.courseId,
    submitted_key: parsed.data.enrollmentKey,
  });

  if (error || !wasEnrolled) return errorState("La clave no coincide. Pedísela a tu docente.");

  revalidatePath("/campus", "layout");
  return successState("Listo, ya estás anotado en el curso.");
}
