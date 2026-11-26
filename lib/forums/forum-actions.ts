"use server";

import { redirect } from "next/navigation";
import { buildCourseForumHref, buildCourseForumTopicHref } from "@/lib/course-content/course-routes";
import { errorState, successState, type FormState } from "@/lib/forms/form-state";
import { authorizeSection } from "@/lib/teacher/course-authorization";
import { parseForm } from "@/lib/teacher/parse-form";
import { nextResourcePosition } from "@/lib/teacher/reorder";
import { revalidateCourse } from "@/lib/teacher/revalidate-course";
import {
  authorizeForumManagement,
  authorizeForumParticipation,
  authorizePostDeletion,
  authorizeTopicDeletion,
  authorizeTopicParticipation,
} from "./forum-authorization";
import {
  createForumSchema,
  createTopicSchema,
  postIdSchema,
  replyToTopicSchema,
  topicIdSchema,
  updateForumSchema,
} from "./forum-schemas";
import { revalidateForum } from "./revalidate-forum";

const RETRY_LATER = "Probá de nuevo en unos segundos.";

export async function createForumAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(createForumSchema, formData);
  if (!parsed.valid) return parsed.state;
  const { sectionId, title, intro } = parsed.data;

  const authorization = await authorizeSection(sectionId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course } = authorization.context;

  const { data: forum, error: forumError } = await supabase
    .from("forums")
    .insert({ section_id: sectionId, title, intro })
    .select("id")
    .single();
  if (forumError || !forum) return errorState(`No pudimos crear el foro. ${RETRY_LATER}`);

  const position = await nextResourcePosition(supabase, sectionId);
  const { error: resourceError } = await supabase
    .from("resources")
    .insert({ section_id: sectionId, kind: "forum", title, forum_id: forum.id, position });
  if (resourceError) {
    await supabase.from("forums").delete().eq("id", forum.id);
    return errorState(`No pudimos agregar el foro a la sección. ${RETRY_LATER}`);
  }

  revalidateCourse(course);
  return successState("Foro creado.");
}

export async function updateForumAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(updateForumSchema, formData);
  if (!parsed.valid) return parsed.state;
  const { forumId, title, intro } = parsed.data;

  const authorization = await authorizeForumManagement(forumId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course } = authorization.context;

  const { error: forumError } = await supabase.from("forums").update({ title, intro }).eq("id", forumId);
  if (forumError) return errorState(`No pudimos guardar los cambios del foro. ${RETRY_LATER}`);

  const { error: resourceError } = await supabase.from("resources").update({ title }).eq("forum_id", forumId);
  if (resourceError) return errorState(`Guardamos el foro, pero no pudimos actualizar su nombre en la sección. ${RETRY_LATER}`);

  revalidateForum(course, forumId);
  return successState("Cambios guardados.");
}

export async function createTopicAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(createTopicSchema, formData);
  if (!parsed.valid) return parsed.state;
  const { forumId, title, body } = parsed.data;

  const authorization = await authorizeForumParticipation(forumId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course } = authorization.context;

  const { data: topic, error } = await supabase
    .from("forum_topics")
    .insert({ forum_id: forumId, title, body })
    .select("id")
    .single();
  if (error || !topic) return errorState(`No pudimos publicar el tema. ${RETRY_LATER}`);

  revalidateForum(course, forumId);
  redirect(buildCourseForumTopicHref(course, forumId, topic.id));
}

export async function replyToTopicAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(replyToTopicSchema, formData);
  if (!parsed.valid) return parsed.state;
  const { topicId, body } = parsed.data;

  const authorization = await authorizeTopicParticipation(topicId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course, forumId } = authorization.context;

  const { error } = await supabase.from("forum_posts").insert({ topic_id: topicId, body });
  if (error) return errorState(`No pudimos publicar tu respuesta. ${RETRY_LATER}`);

  revalidateForum(course, forumId);
  return successState("Respuesta publicada.");
}

export async function deleteTopicAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(topicIdSchema, formData);
  if (!parsed.valid) return parsed.state;

  const authorization = await authorizeTopicDeletion(parsed.data.topicId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course, forumId } = authorization.context;

  const { error } = await supabase.from("forum_topics").delete().eq("id", parsed.data.topicId);
  if (error) return errorState(`No pudimos eliminar el tema. ${RETRY_LATER}`);

  revalidateForum(course, forumId);
  redirect(buildCourseForumHref(course, forumId));
}

export async function deletePostAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(postIdSchema, formData);
  if (!parsed.valid) return parsed.state;

  const authorization = await authorizePostDeletion(parsed.data.postId);
  if (!authorization.allowed) return authorization.state;
  const { supabase, course, forumId } = authorization.context;

  const { error } = await supabase.from("forum_posts").delete().eq("id", parsed.data.postId);
  if (error) return errorState(`No pudimos eliminar la respuesta. ${RETRY_LATER}`);

  revalidateForum(course, forumId);
  return successState("Respuesta eliminada.");
}
