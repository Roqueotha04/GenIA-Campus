"use server";

import { COURSE_MATERIALS_BUCKET } from "@/lib/storage/storage-buckets";
import { findRegisteredGame } from "@/data/games";
import { errorState, successState, type FormState } from "@/lib/forms/form-state";
import { authorizeResource, authorizeSection } from "./course-authorization";
import { parseForm } from "./parse-form";
import { nextResourcePosition, persistPositions, swapWithNeighbor } from "./reorder";
import { revalidateCourse } from "./revalidate-course";
import {
  createGameResourceSchema,
  createLinkResourceSchema,
  moveResourceSchema,
  renameResourceSchema,
  resourceIdSchema,
} from "./teacher-schemas";

const SAVE_FAILED = "No pudimos guardar el recurso. Probá de nuevo en unos segundos.";

export async function createLinkResourceAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(createLinkResourceSchema, formData);
  if (!parsed.valid) return parsed.state;

  const authorization = await authorizeSection(parsed.data.sectionId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course } = authorization.context;

  const position = await nextResourcePosition(supabase, parsed.data.sectionId);
  const { error } = await supabase.from("resources").insert({
    section_id: parsed.data.sectionId,
    kind: "link",
    title: parsed.data.title,
    url: parsed.data.url,
    position,
  });
  if (error) return errorState(SAVE_FAILED);

  revalidateCourse(course);
  return successState("Enlace agregado.");
}

export async function createGameResourceAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(createGameResourceSchema, formData);
  if (!parsed.valid) return parsed.state;

  const game = findRegisteredGame(parsed.data.gameSlug);
  if (!game) return errorState("Ese juego no está disponible. Elegí uno de la lista.");

  const authorization = await authorizeSection(parsed.data.sectionId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course } = authorization.context;

  const position = await nextResourcePosition(supabase, parsed.data.sectionId);
  const { error } = await supabase.from("resources").insert({
    section_id: parsed.data.sectionId,
    kind: "game",
    title: game.title,
    game_slug: game.slug,
    position,
  });
  if (error) return errorState(SAVE_FAILED);

  revalidateCourse(course);
  return successState("Juego agregado.");
}

export async function renameResourceAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(renameResourceSchema, formData);
  if (!parsed.valid) return parsed.state;

  const authorization = await authorizeResource(parsed.data.resourceId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course } = authorization.context;

  const { error } = await supabase
    .from("resources")
    .update({ title: parsed.data.title })
    .eq("id", parsed.data.resourceId);
  if (error) return errorState("No pudimos cambiar el título. Probá de nuevo en unos segundos.");

  revalidateCourse(course);
  return successState("Título actualizado.");
}

export async function deleteResourceAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(resourceIdSchema, formData);
  if (!parsed.valid) return parsed.state;

  const authorization = await authorizeResource(parsed.data.resourceId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course } = authorization.context;

  const { data: resource } = await supabase
    .from("resources")
    .select("storage_path")
    .eq("id", parsed.data.resourceId)
    .maybeSingle();

  const { error } = await supabase.from("resources").delete().eq("id", parsed.data.resourceId);
  if (error) return errorState("No pudimos eliminar el recurso. Probá de nuevo en unos segundos.");

  if (resource?.storage_path) {
    await supabase.storage.from(COURSE_MATERIALS_BUCKET).remove([resource.storage_path]);
  }

  revalidateCourse(course);
  return successState("Recurso eliminado.");
}

export async function moveResourceAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(moveResourceSchema, formData);
  if (!parsed.valid) return parsed.state;

  const authorization = await authorizeResource(parsed.data.resourceId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course } = authorization.context;

  const { data: current } = await supabase
    .from("resources")
    .select("section_id")
    .eq("id", parsed.data.resourceId)
    .maybeSingle();
  if (!current) return errorState("No encontramos el recurso. Recargá la página y probá de nuevo.");

  const { data: siblings } = await supabase
    .from("resources")
    .select("id")
    .eq("section_id", current.section_id)
    .order("position")
    .order("created_at");

  const reordered = swapWithNeighbor(siblings ?? [], parsed.data.resourceId, parsed.data.direction);
  if (!reordered) return errorState("El recurso ya está en ese extremo de la lista.");

  const saved = await persistPositions(supabase, "resources", reordered.map((resource) => resource.id));
  if (!saved) return errorState("No pudimos reordenar los recursos. Recargá la página y probá de nuevo.");

  revalidateCourse(course);
  return successState("Orden actualizado.");
}
