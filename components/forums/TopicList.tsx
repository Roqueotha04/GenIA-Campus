import { buildCourseForumTopicHref } from "@/lib/course-content/course-routes";
import type { CourseSummary } from "@/lib/courses/course-access";
import type { ForumTopicSummary } from "@/lib/forums/forum-types";
import { TopicRow } from "./TopicRow";

interface TopicListProps {
  course: CourseSummary;
  forumId: string;
  topics: ForumTopicSummary[];
  canPost: boolean;
}

const emptyMessages = {
  canPost: "Todavía no hay temas. Abrí el primero con “Nuevo tema”.",
  readOnly: "Todavía no hay temas. Cuando alguien abra uno, aparece acá.",
};

export function TopicList({ course, forumId, topics, canPost }: TopicListProps) {
  if (topics.length === 0) {
    return (
      <p className="rounded-sm border border-dashed border-line px-4 py-8 text-center text-sm text-muted">
        {canPost ? emptyMessages.canPost : emptyMessages.readOnly}
      </p>
    );
  }

  return (
    <div className="rounded-sm border border-line bg-surface">
      <div className="hidden grid-cols-[minmax(0,1fr)_8rem_11rem] gap-6 border-b border-line px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted md:grid">
        <span>Tema</span>
        <span>Respuestas</span>
        <span>Última actividad</span>
      </div>
      <ul className="divide-y divide-line">
        {topics.map((topic) => (
          <TopicRow key={topic.id} topic={topic} href={buildCourseForumTopicHref(course, forumId, topic.id)} />
        ))}
      </ul>
    </div>
  );
}
