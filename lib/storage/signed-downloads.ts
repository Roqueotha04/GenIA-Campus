import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { SIGNED_DOWNLOAD_SECONDS } from "./storage-buckets";

export async function createSignedDownloadUrls(
  bucket: string,
  paths: string[],
): Promise<Map<string, string>> {
  if (paths.length === 0) return new Map();

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.storage
    .from(bucket)
    .createSignedUrls(paths, SIGNED_DOWNLOAD_SECONDS, { download: true });

  return new Map(
    (data ?? []).flatMap((entry) =>
      entry.path && entry.signedUrl ? [[entry.path, entry.signedUrl] as const] : [],
    ),
  );
}
