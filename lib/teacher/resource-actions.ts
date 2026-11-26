"use server";

import { revalidatePath } from "next/cache";
import {
  collectAssignmentStoredFiles,
  removeAssignmentStoredFiles,
} from "@/lib/assignments/assignment-stored-files";
import { removeStoredFiles } from "@/lib/assignments/remove-stored-files";
import { buildCourseAssignmentHref, buildCourseForumHref } from "@/lib/course-content/course-routes";
import type { CourseSummary } from "@/lib/courses/course-access";
import { errorState, successState, type FormState } from "@/lib/forms/form-state";
import { COURSE_MATERIALS_BUCKET } from "@/lib/storage/storage-buckets";
import type { TableRow } from "@/types/database";
import { authorizeResource, type SupabaseServerClient } from "./course-authorization";
import { parseForm } from "./parse-form";
import { persistPositions, swapWithNeighbor } from "./reorder";
import { revalidateCourse } from "./revalidate-course";
import { moveResourceSchema, renameResourceSchema, resourceIdSchema } from "./teacher-schemas";

type ItemTarget = Pick<TableRow<"resources">, "id" | "storage_path" | "assignment_id" | "forum_id">;

const RESOURCE_NOT_FOUND = errorState("No encontramos el elemento. Recargá la página y probá de nuevo.");

async function readItemTarget(supabase: SupabaseServerClient, resourceId: string): Promise<ItemTarget | null> {
  const { data } = await supabase
    .from("resources")
    .select("id, storage_path, assignment_id, forum_id")
    .eq("id", resourceId)
    .maybeSingle();
  return data;
}

function revalidateItem(course: CourseSummary, item: ItemTarget): void {
  revalidateCourse(course);
  if (item.assignment_id) revalidatePath(buildCourseAssignmentHref(course, item.assignment_id));
  if (item.forum_id) revalidatePath(buildCourseForumHref(course, item.forum_id), "layout");
}

async function renameLinkedEntity(supabase: SupabaseServerClient, item: ItemTarget, title: string): Promise<boolean> {
  if (item.assignment_id) {
    const { error } = await supabase.from("assignments").update({ title }).eq("id", item.assignment_id);
    return !error;
  }
  if (item.forum_id) {
    const { error } = await supabase.from("forums").update({ title }).eq("id", item.forum_id);
    return !error;
  }
  return true;
}

async function deleteAssignmentItem(supabase: SupabaseServerClient, assignmentId: string): Promise<boolean> {
  const storedFiles = await collectAssignmentStoredFiles(supabase, [assignmentId]);
  const { error } = await supabase.from("assignments").delete().eq("id", assignmentId);
  if (error) return false;
  await removeAssignmentStoredFiles(supabase, storedFiles);
  return true;
}

async function deleteForumItem(supabase: SupabaseServerClient, forumId: string): Promise<boolean> {
  const { error } = await supabase.from("forums").delete().eq("id", forumId);
  return !error;
}

async function deleteResourceRow(supabase: SupabaseServerClient, item: ItemTarget): Promise<boolean> {
  const { error } = await supabase.from("resources").delete().eq("id", item.id);
  if (error) return false;
  await removeStoredFiles(supabase, COURSE_MATERIALS_BUCKET, [item.storage_path]);
  return true;
}

function deleteItem(supabase: SupabaseServerClient, item: ItemTarget): Promise<boolean> {
  if (item.assignment_id) return deleteAssignmentItem(supabase, item.assignment_id);
  if (item.forum_id) return deleteForumItem(supabase, item.forum_id);
  return deleteResourceRow(supabase, item);
}

export async function renameResourceAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(renameResourceSchema, formData);
  if (!parsed.valid) return parsed.state;

  const authorization = await authorizeResource(parsed.data.resourceId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course } = authorization.context;

  const item = await readItemTarget(supabase, parsed.data.resourceId);
  if (!item) return RESOURCE_NOT_FOUND;

  const { error } = await supabase
    .from("resources")
    .update({ title: parsed.data.title })
    .eq("id", item.id);
  const renamed = !error && (await renameLinkedEntity(supabase, item, parsed.data.title));
  if (!renamed) return errorState("No pudimos cambiar el nombre. Probá de nuevo en unos segundos.");

  revalidateItem(course, item);
  return successState("Nombre actualizado.");
}

export async function deleteResourceAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(resourceIdSchema, formData);
  if (!parsed.valid) return parsed.state;

  const authorization = await authorizeResource(parsed.data.resourceId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course } = authorization.context;

  const item = await readItemTarget(supabase, parsed.data.resourceId);
  if (!item) return RESOURCE_NOT_FOUND;

  const deleted = await deleteItem(supabase, item);
  if (!deleted) return errorState("No pudimos eliminar el elemento. Probá de nuevo en unos segundos.");

  revalidateItem(course, item);
  return successState("Elemento eliminado.");
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
  if (!current) return RESOURCE_NOT_FOUND;

  const { data: siblings } = await supabase
    .from("resources")
    .select("id")
    .eq("section_id", current.section_id)
    .order("position")
    .order("created_at");

  const reordered = swapWithNeighbor(siblings ?? [], parsed.data.resourceId, parsed.data.direction);
  if (!reordered) return errorState("El elemento ya está en ese extremo de la lista.");

  const saved = await persistPositions(supabase, "resources", reordered.map((resource) => resource.id));
  if (!saved) return errorState("No pudimos reordenar los elementos. Recargá la página y probá de nuevo.");

  revalidateCourse(course);
  return successState("Orden actualizado.");
}
