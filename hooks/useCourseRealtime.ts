"use client";

import { useEffect, useRef } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

export type CourseRealtimeTable = "resources" | "assignments" | "notices" | "sections";

export interface CourseChange {
  table: CourseRealtimeTable;
  isInsert: boolean;
  title: string | null;
}

const WATCHED_TABLES: CourseRealtimeTable[] = ["resources", "assignments", "notices", "sections"];

function readTitle(record: object): string | null {
  const title: unknown = Reflect.get(record, "title");
  return typeof title === "string" ? title : null;
}

export function useCourseRealtime(courseId: string, onChange: (change: CourseChange) => void) {
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const channel = supabase.channel(`course-${courseId}`);

    WATCHED_TABLES.forEach((table) => {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table, filter: `course_id=eq.${courseId}` },
        (payload) =>
          onChangeRef.current({
            table,
            isInsert: payload.eventType === "INSERT",
            title: readTitle(payload.new),
          }),
      );
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [courseId]);
}
