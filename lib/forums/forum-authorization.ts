import "server-only";
import { getCurrentProfile, type CurrentProfile } from "@/lib/auth/current-profile";
import { COURSE_SUMMARY_COLUMNS, getCourseAccess, type CourseSummary } from "@/lib/courses/course-access";
import { errorState, type FormState } from "@/lib/forms/form-state";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { authorizeCourse, type AuthorizedCourse, type SupabaseServerClient } from "@/lib/teacher/course-authorization";
import { GUEST_FORUM_MESSAGE } from "./forum-guest";

export interface ParticipantContext {
  supabase: SupabaseServerClient;
  course: CourseSummary;
  forumId: string;
  profile: CurrentProfile;
  canManage: boolean;
}

type Authorized<Context> = { allowed: true; context: Context } | { allowed: false; state: FormState };

type AuthoredTable = "forum_topics" | "forum_posts";

const SESSION_EXPIRED = errorState("Tu sesión venció. Volvé a iniciar sesión y probá de nuevo.");
const NOT_FOUND = errorState("No encontramos ese foro o mensaje. Recargá la página y probá de nuevo.");
const NOT_MEMBER = errorState("Solo los integrantes del curso pueden participar en el foro. Inscribite con la clave del curso.");
const NOT_AUTHOR = errorState("Solo podés eliminar tus propios mensajes.");

async function findForumCourseId(supabase: SupabaseServerClient, forumId: string): Promise<string | null> {
  const { data } = await supabase.from("forums").select("course_id").eq("id", forumId).maybeSingle();
  return data?.course_id ?? null;
}

async function findCourse(supabase: SupabaseServerClient, courseId: string): Promise<CourseSummary | null> {
  const { data } = await supabase.from("courses").select(COURSE_SUMMARY_COLUMNS).eq("id", courseId).maybeSingle();
  return data;
}

export async function authorizeForumManagement(
  forumId: string,
): Promise<Authorized<AuthorizedCourse & { forumId: string }>> {
  const supabase = await createSupabaseServerClient();
  const courseId = await findForumCourseId(supabase, forumId);
  if (!courseId) return { allowed: false, state: NOT_FOUND };

  const authorization = await authorizeCourse(courseId);
  if (!authorization.allowed) return authorization;
  return { allowed: true, context: { ...authorization.context, forumId } };
}

export async function authorizeForumParticipation(forumId: string): Promise<Authorized<ParticipantContext>> {
  const profile = await getCurrentProfile();
  if (!profile) return { allowed: false, state: SESSION_EXPIRED };
  if (profile.isGuest) return { allowed: false, state: errorState(GUEST_FORUM_MESSAGE) };

  const supabase = await createSupabaseServerClient();
  const courseId = await findForumCourseId(supabase, forumId);
  const course = courseId ? await findCourse(supabase, courseId) : null;
  if (!course) return { allowed: false, state: NOT_FOUND };

  const { canView, canManage } = await getCourseAccess(course.id, profile);
  if (!canView) return { allowed: false, state: NOT_MEMBER };

  return { allowed: true, context: { supabase, course, forumId, profile, canManage } };
}

export async function authorizeTopicParticipation(
  topicId: string,
): Promise<Authorized<ParticipantContext & { topicId: string }>> {
  const supabase = await createSupabaseServerClient();
  const { data: topic } = await supabase.from("forum_topics").select("forum_id").eq("id", topicId).maybeSingle();
  if (!topic) return { allowed: false, state: NOT_FOUND };

  const authorization = await authorizeForumParticipation(topic.forum_id);
  if (!authorization.allowed) return authorization;
  return { allowed: true, context: { ...authorization.context, topicId } };
}

async function findTopicOwnership(supabase: SupabaseServerClient, topicId: string) {
  const { data } = await supabase.from("forum_topics").select("id, author_id").eq("id", topicId).maybeSingle();
  return data ? { topicId: data.id, authorId: data.author_id } : null;
}

async function findPostOwnership(supabase: SupabaseServerClient, postId: string) {
  const { data } = await supabase.from("forum_posts").select("topic_id, author_id").eq("id", postId).maybeSingle();
  return data ? { topicId: data.topic_id, authorId: data.author_id } : null;
}

const ownershipFinders: Record<AuthoredTable, typeof findTopicOwnership> = {
  forum_topics: findTopicOwnership,
  forum_posts: findPostOwnership,
};

async function authorizeAuthoredDeletion(
  table: AuthoredTable,
  rowId: string,
): Promise<Authorized<ParticipantContext & { topicId: string }>> {
  const supabase = await createSupabaseServerClient();
  const ownership = await ownershipFinders[table](supabase, rowId);
  if (!ownership) return { allowed: false, state: NOT_FOUND };

  const authorization = await authorizeTopicParticipation(ownership.topicId);
  if (!authorization.allowed) return authorization;

  const { profile, canManage } = authorization.context;
  if (!canManage && ownership.authorId !== profile.id) return { allowed: false, state: NOT_AUTHOR };
  return authorization;
}

export const authorizeTopicDeletion = (topicId: string) => authorizeAuthoredDeletion("forum_topics", topicId);

export const authorizePostDeletion = (postId: string) => authorizeAuthoredDeletion("forum_posts", postId);
