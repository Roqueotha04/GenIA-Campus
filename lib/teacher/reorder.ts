import "server-only";
import type { SupabaseServerClient } from "./course-authorization";

export type MoveDirection = "up" | "down";

type OrderedTable = "sections" | "resources";

export function swapWithNeighbor<Item extends { id: string }>(
  items: Item[],
  itemId: string,
  direction: MoveDirection,
): Item[] | null {
  const index = items.findIndex((item) => item.id === itemId);
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || targetIndex < 0 || targetIndex >= items.length) return null;

  const reordered = [...items];
  [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
  return reordered;
}

export async function persistPositions(
  supabase: SupabaseServerClient,
  table: OrderedTable,
  orderedIds: string[],
): Promise<boolean> {
  const results = await Promise.all(
    orderedIds.map((id, position) => supabase.from(table).update({ position }).eq("id", id)),
  );
  return results.every(({ error }) => !error);
}

function positionAfter(lastPosition: number | undefined): number {
  return (lastPosition ?? -1) + 1;
}

export async function nextSectionPosition(
  supabase: SupabaseServerClient,
  courseId: string,
): Promise<number> {
  const { data } = await supabase
    .from("sections")
    .select("position")
    .eq("course_id", courseId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  return positionAfter(data?.position);
}

export async function nextResourcePosition(
  supabase: SupabaseServerClient,
  sectionId: string,
): Promise<number> {
  const { data } = await supabase
    .from("resources")
    .select("position")
    .eq("section_id", sectionId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  return positionAfter(data?.position);
}
