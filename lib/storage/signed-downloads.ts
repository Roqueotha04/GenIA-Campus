import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { buildDownloadFileName } from "./download-file-name";
import { SIGNED_DOWNLOAD_SECONDS } from "./storage-buckets";

export interface DownloadableFile {
  path: string;
  displayName: string;
}

export async function createSignedDownloadUrls(
  bucket: string,
  files: DownloadableFile[],
): Promise<Map<string, string>> {
  if (files.length === 0) return new Map();

  const storage = (await createSupabaseServerClient()).storage.from(bucket);
  const signedEntries = await Promise.all(
    files.map(async ({ path, displayName }) => {
      const { data } = await storage.createSignedUrl(path, SIGNED_DOWNLOAD_SECONDS, {
        download: buildDownloadFileName(displayName, path),
      });
      return data ? [[path, data.signedUrl] as const] : [];
    }),
  );

  return new Map(signedEntries.flat());
}
