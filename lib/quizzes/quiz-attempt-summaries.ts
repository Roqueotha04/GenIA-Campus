import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export interface StudentAttemptSummary {
  studentId: string;
  studentName: string;
  attemptCount: number;
  bestScore: number;
  lastScore: number;
  total: number;
  lastSubmittedAt: string;
  passed: boolean;
}

interface AttemptRow {
  student_id: string;
  score: number;
  total: number;
  submitted_at: string;
}

function summarizeStudent(
  studentId: string,
  studentName: string,
  attempts: AttemptRow[],
  passingScore: number,
): StudentAttemptSummary {
  const [lastAttempt] = attempts;
  const bestScore = Math.max(...attempts.map((attempt) => attempt.score));
  return {
    studentId,
    studentName,
    attemptCount: attempts.length,
    bestScore,
    lastScore: lastAttempt.score,
    total: lastAttempt.total,
    lastSubmittedAt: lastAttempt.submitted_at,
    passed: bestScore >= passingScore,
  };
}

function groupByStudent(attempts: AttemptRow[]): Map<string, AttemptRow[]> {
  const groups = new Map<string, AttemptRow[]>();
  for (const attempt of attempts) {
    groups.set(attempt.student_id, [...(groups.get(attempt.student_id) ?? []), attempt]);
  }
  return groups;
}

async function loadStudentNames(studentIds: string[]): Promise<Map<string, string>> {
  if (studentIds.length === 0) return new Map();
  const { data } = await createSupabaseAdminClient()
    .from("profiles")
    .select("id, full_name, email")
    .in("id", studentIds);
  return new Map((data ?? []).map((profile) => [profile.id, profile.full_name || profile.email]));
}

export async function loadQuizAttemptSummaries(
  quizId: string,
  passingScore: number,
): Promise<StudentAttemptSummary[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("quiz_attempts")
    .select("student_id, score, total, submitted_at")
    .eq("quiz_id", quizId)
    .order("submitted_at", { ascending: false });

  const groups = groupByStudent(data ?? []);
  const names = await loadStudentNames([...groups.keys()]);

  return [...groups.entries()]
    .map(([studentId, attempts]) =>
      summarizeStudent(studentId, names.get(studentId) ?? "Alumno sin nombre", attempts, passingScore),
    )
    .sort((first, second) => second.lastSubmittedAt.localeCompare(first.lastSubmittedAt));
}
