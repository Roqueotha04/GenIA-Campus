"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

const WATCHED_FORUM_TABLES = ["forums", "forum_topics", "forum_posts"] as const;

export function ForumLiveUpdates({ courseId }: { courseId: string }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const channel = supabase.channel(`course-forums-${courseId}`);

    WATCHED_FORUM_TABLES.forEach((table) => {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table, filter: `course_id=eq.${courseId}` },
        () => router.refresh(),
      );
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [courseId, router]);

  return null;
}
