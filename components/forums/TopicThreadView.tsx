import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildCourseForumHref } from "@/lib/course-content/course-routes";
import type { CourseSummary } from "@/lib/courses/course-access";
import type { ForumRecord, ForumTopicThread } from "@/lib/forums/forum-types";
import { ForumBreadcrumb } from "./ForumBreadcrumb";
import { ForumLiveUpdates } from "./ForumLiveUpdates";
import { GuestForumNotice } from "./GuestForumNotice";
import { ReplyForm } from "./ReplyForm";
import { TopicThread } from "./TopicThread";

interface TopicThreadViewProps {
  course: CourseSummary;
  levelName: string;
  forum: ForumRecord;
  thread: ForumTopicThread;
  canPost: boolean;
}

export function TopicThreadView({ course, levelName, forum, thread, canPost }: TopicThreadViewProps) {
  const forumHref = buildCourseForumHref(course, forum.id);

  return (
    <Section>
      <ForumBreadcrumb
        course={course}
        levelName={levelName}
        trail={[{ label: forum.title, href: forumHref }, { label: thread.title }]}
      />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading level={1} eyebrow={forum.title} title={thread.title} />
        <Button href={forumHref} variant="outline" size="sm">
          <ArrowLeftIcon className="h-4 w-4" />
          Volver al foro
        </Button>
      </div>
      <div className="mt-8 max-w-3xl space-y-8">
        <TopicThread thread={thread} />
        <section aria-label="Responder" className="rounded-sm border border-line bg-surface p-4">
          {canPost ? <ReplyForm topicId={thread.id} /> : <GuestForumNotice />}
        </section>
      </div>
      <ForumLiveUpdates courseId={course.id} />
    </Section>
  );
}
