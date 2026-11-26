import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildCourseHref, type CourseSummary } from "@/lib/courses/course-access";
import type { ForumRecord, ForumTopicSummary } from "@/lib/forums/forum-types";
import { EditForumButton } from "./EditForumButton";
import { ForumBreadcrumb } from "./ForumBreadcrumb";
import { ForumLiveUpdates } from "./ForumLiveUpdates";
import { GuestForumNotice } from "./GuestForumNotice";
import { NewTopicButton } from "./NewTopicButton";
import { TopicList } from "./TopicList";

interface ForumViewProps {
  course: CourseSummary;
  levelName: string;
  forum: ForumRecord;
  topics: ForumTopicSummary[];
  canPost: boolean;
  canManage: boolean;
}

export function ForumView({ course, levelName, forum, topics, canPost, canManage }: ForumViewProps) {
  return (
    <Section>
      <ForumBreadcrumb course={course} levelName={levelName} trail={[{ label: forum.title }]} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading level={1} eyebrow="Foro" title={forum.title} />
        <Button href={buildCourseHref(course)} variant="outline" size="sm">
          <ArrowLeftIcon className="h-4 w-4" />
          Volver al módulo
        </Button>
      </div>
      {forum.intro && (
        <p className="mt-4 max-w-3xl whitespace-pre-line text-base leading-relaxed text-foreground">{forum.intro}</p>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {canPost && <NewTopicButton forumId={forum.id} />}
        {canManage && <EditForumButton forum={forum} />}
      </div>
      {!canPost && (
        <div className="mt-6">
          <GuestForumNotice />
        </div>
      )}
      <div className="mt-6">
        <TopicList course={course} forumId={forum.id} topics={topics} canPost={canPost} />
      </div>
      <ForumLiveUpdates courseId={course.id} />
    </Section>
  );
}
