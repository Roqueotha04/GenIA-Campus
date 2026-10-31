"use client";

import { sampleResults } from "@/data/sample-results";
import type { Activity } from "@/data/schemas";
import { useSession } from "@/hooks/useSession";
import { Section } from "@/components/ui/Section";

export function TeacherResultsPanel({ activity }: { activity: Activity }) {
  const { user } = useSession();

  if (user?.role !== "docente") return null;

  return (
    <Section className="py-8 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Resultados de alumnos
        </h2>
        <p className="text-sm text-muted">
          Nota de aprobación: <span className="text-foreground">{activity.passingScore}</span> ·
          Datos de ejemplo
        </p>
      </div>
      <div className="mt-6 overflow-x-auto border border-line bg-surface">
        <table className="w-full min-w-md text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[0.7rem] uppercase tracking-[0.18em] text-muted">
              <th scope="col" className="px-5 py-4 font-medium">Alumno</th>
              <th scope="col" className="px-5 py-4 font-medium">Nota</th>
              <th scope="col" className="px-5 py-4 font-medium">Estado</th>
              <th scope="col" className="px-5 py-4 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {sampleResults.map((result) => {
              const passed = result.score >= activity.passingScore;
              return (
                <tr key={result.studentName} className="border-b border-line last:border-b-0">
                  <th scope="row" className="px-5 py-4 font-medium text-foreground">
                    {result.studentName}
                  </th>
                  <td className="px-5 py-4 text-foreground">
                    {result.score}/{result.total}
                  </td>
                  <td className={`px-5 py-4 ${passed ? "text-success" : "text-danger"}`}>
                    {passed ? "Aprobado" : "No aprobado"}
                  </td>
                  <td className="px-5 py-4 text-muted">{result.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
