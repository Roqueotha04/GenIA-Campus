import "server-only";
import { formatMoment } from "@/lib/assignments/assignment-time";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import type { TableRow } from "@/types/database";
import type {
  ForumPostKind,
  ForumPostView,
  ForumRecord,
  ForumTopicSummary,
  ForumTopicThread,
  ForumViewer,
} from "./forum-types";

type AuthoredRow = Pick<TableRow<"forum_posts">, "id" | "author_id" | "author_name" | "body" | "created_at">;

interface TopicActivity {
  replyCount: number;
  lastActivityAt: string;
}

const UNKNOWN_AUTHOR = "Integrante del curso";

export async function findCourseForum(courseId: string, forumId: string): Promise<ForumRecord | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("forums")
    .select("id, section_id, title, intro")
    .eq("id", forumId)
    .eq("course_id", courseId)
    .maybeSingle();
  return data ? { id: data.id, sectionId: data.section_id, title: data.title, intro: data.intro } : null;
}

function summarizeActivity(
  topicCreatedAt: string,
  replies: Pick<TableRow<"forum_posts">, "created_at">[],
): TopicActivity {
  const lastActivityAt = replies.reduce(
    (latest, reply) => (reply.created_at > latest ? reply.created_at : latest),
    topicCreatedAt,
  );
  return { replyCount: replies.length, lastActivityAt };
}

export async function listForumTopics(forumId: string): Promise<ForumTopicSummary[]> {
  const supabase = await createSupabaseServerClient();
  const { data: topics } = await supabase
    .from("forum_topics")
    .select("id, title, author_name, created_at")
    .eq("forum_id", forumId);
  if (!topics?.length) return [];

  const { data: replies } = await supabase
    .from("forum_posts")
    .select("topic_id, created_at")
    .in("topic_id", topics.map((topic) => topic.id));

  return topics
    .map((topic) => ({
      topic,
      activity: summarizeActivity(
        topic.created_at,
        (replies ?? []).filter((reply) => reply.topic_id === topic.id),
      ),
    }))
    .sort((first, second) => second.activity.lastActivityAt.localeCompare(first.activity.lastActivityAt))
    .map(({ topic, activity }) => ({
      id: topic.id,
      title: topic.title,
      authorName: topic.author_name || UNKNOWN_AUTHOR,
      createdLabel: formatMoment(topic.created_at),
      replyCount: activity.replyCount,
      lastActivityLabel: formatMoment(activity.lastActivityAt),
    }));
}

function toPostView(row: AuthoredRow, kind: ForumPostKind, viewer: ForumViewer): ForumPostView {
  return {
    id: row.id,
    kind,
    authorName: row.author_name || UNKNOWN_AUTHOR,
    body: row.body,
    createdLabel: formatMoment(row.created_at),
    canDelete: viewer.canManage || row.author_id === viewer.profileId,
  };
}

export async function loadTopicThread(
  forumId: string,
  topicId: string,
  viewer: ForumViewer,
): Promise<ForumTopicThread | null> {
  const supabase = await createSupabaseServerClient();
  const { data: topic } = await supabase
    .from("forum_topics")
    .select("id, title, author_id, author_name, body, created_at")
    .eq("id", topicId)
    .eq("forum_id", forumId)
    .maybeSingle();
  if (!topic) return null;

  const { data: replies } = await supabase
    .from("forum_posts")
    .select("id, author_id, author_name, body, created_at")
    .eq("topic_id", topicId)
    .order("created_at", { ascending: true });

  return {
    id: topic.id,
    title: topic.title,
    openingPost: toPostView(topic, "topic", viewer),
    replies: (replies ?? []).map((reply) => toPostView(reply, "reply", viewer)),
  };
}
