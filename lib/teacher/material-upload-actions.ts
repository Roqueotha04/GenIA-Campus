"use server";

import { errorState, successState, type FormState } from "@/lib/forms/form-state";
import {
  ACCEPTED_UPLOAD_TYPES,
  COURSE_MATERIALS_BUCKET,
  MAX_UPLOAD_BYTES,
  buildCourseMaterialPath,
} from "@/lib/storage/storage-buckets";
import { authorizeSection, type SupabaseServerClient } from "./course-authorization";
import { parseInput } from "./parse-form";
import { nextResourcePosition } from "./reorder";
import { revalidateCourse } from "./revalidate-course";
import { registerMaterialSchema, sectionIdSchema } from "./teacher-schemas";

export type PreparedUpload =
  | { prepared: true; path: string; token: string }
  | { prepared: false; message: string };

const MAX_UPLOAD_MEGABYTES = MAX_UPLOAD_BYTES / (1024 * 1024);

function hasAcceptedExtension(fileName: string): boolean {
  const lowerName = fileName.toLowerCase();
  return ACCEPTED_UPLOAD_TYPES.split(",").some((extension) => lowerName.endsWith(extension));
}

export async function prepareMaterialUpload(
  sectionId: string,
  fileName: string,
  sizeBytes: number,
): Promise<PreparedUpload> {
  const parsed = parseInput(sectionIdSchema, { sectionId });
  if (!parsed.valid) return { prepared: false, message: parsed.state.message };

  if (!hasAcceptedExtension(fileName)) {
    return { prepared: false, message: "Ese tipo de archivo no está permitido. Subí un PDF, Office, imagen, ZIP o texto." };
  }
  if (sizeBytes > MAX_UPLOAD_BYTES) {
    return { prepared: false, message: `El archivo supera los ${MAX_UPLOAD_MEGABYTES} MB. Comprimilo o subí una versión más liviana.` };
  }

  const authorization = await authorizeSection(sectionId);
  if (!authorization.allowed) return { prepared: false, message: authorization.state.message };
  const { supabase, course } = authorization.context;

  const path = buildCourseMaterialPath(course.id, sectionId, fileName);
  const { data, error } = await supabase.storage.from(COURSE_MATERIALS_BUCKET).createSignedUploadUrl(path);
  if (error || !data) {
    return { prepared: false, message: "No pudimos preparar la subida. Probá de nuevo en unos segundos." };
  }

  return { prepared: true, path, token: data.token };
}

interface RegisterMaterialInput {
  sectionId: string;
  title: string;
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
}

async function discardUploadedObject(
  supabase: SupabaseServerClient,
  storagePath: string,
) {
  await supabase.storage.from(COURSE_MATERIALS_BUCKET).remove([storagePath]);
}

export async function registerMaterial(input: RegisterMaterialInput): Promise<FormState> {
  const parsed = parseInput(registerMaterialSchema, input);
  if (!parsed.valid) return parsed.state;
  const { sectionId, title, storagePath, mimeType, sizeBytes } = parsed.data;

  const authorization = await authorizeSection(sectionId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course } = authorization.context;

  const belongsToSection = storagePath.startsWith(`${course.id}/${sectionId}/`);
  if (!belongsToSection || sizeBytes > MAX_UPLOAD_BYTES) {
    if (belongsToSection) await discardUploadedObject(supabase, storagePath);
    return errorState(`El archivo no es válido o supera los ${MAX_UPLOAD_MEGABYTES} MB. Subilo de nuevo.`);
  }

  const position = await nextResourcePosition(supabase, sectionId);
  const { error } = await supabase.from("resources").insert({
    section_id: sectionId,
    kind: "file",
    title,
    storage_path: storagePath,
    mime_type: mimeType || null,
    size_bytes: sizeBytes,
    position,
  });
  if (error) {
    await discardUploadedObject(supabase, storagePath);
    return errorState("El archivo se subió pero no pudimos registrarlo. Probá de nuevo.");
  }

  revalidateCourse(course);
  return successState("Archivo agregado.");
}
