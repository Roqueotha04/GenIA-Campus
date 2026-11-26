import "server-only";
import type { SupabaseServerClient } from "@/lib/teacher/course-authorization";

export async function removeStoredFiles(
  supabase: SupabaseServerClient,
  bucket: string,
  paths: Array<string | null>,
): Promise<void> {
  const existingPaths = paths.filter((path): path is string => Boolean(path));
  if (existingPaths.length === 0) return;
  await supabase.storage.from(bucket).remove(existingPaths);
}
