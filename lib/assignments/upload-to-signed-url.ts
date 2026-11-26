import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

export type PreparedUploadResult =
  | { prepared: true; path: string; token: string }
  | { prepared: false; message: string };

export type UploadOutcome =
  | { uploaded: true; path: string; name: string }
  | { uploaded: false; message: string };

interface DirectUpload {
  file: File;
  bucket: string;
  prepare: (fileName: string, sizeBytes: number) => Promise<PreparedUploadResult>;
}

export async function uploadDirectly({ file, bucket, prepare }: DirectUpload): Promise<UploadOutcome> {
  const prepared = await prepare(file.name, file.size);
  if (!prepared.prepared) return { uploaded: false, message: prepared.message };

  const { error } = await createSupabaseBrowserClient()
    .storage.from(bucket)
    .uploadToSignedUrl(prepared.path, prepared.token, file, { contentType: file.type });
  if (error) {
    return { uploaded: false, message: "No pudimos subir el archivo. Revisá tu conexión y probá de nuevo." };
  }

  return { uploaded: true, path: prepared.path, name: file.name };
}
