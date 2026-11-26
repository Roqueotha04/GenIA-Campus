export type ForumPostKind = "topic" | "reply";

export interface ForumRecord {
  id: string;
  sectionId: string;
  title: string;
  intro: string;
}

export interface ForumTopicSummary {
  id: string;
  title: string;
  authorName: string;
  createdLabel: string;
  replyCount: number;
  lastActivityLabel: string;
}

export interface ForumPostView {
  id: string;
  kind: ForumPostKind;
  authorName: string;
  body: string;
  createdLabel: string;
  canDelete: boolean;
}

export interface ForumTopicThread {
  id: string;
  title: string;
  openingPost: ForumPostView;
  replies: ForumPostView[];
}

export interface ForumViewer {
  profileId: string;
  canManage: boolean;
}
