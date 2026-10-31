import type { Activity } from "@/data/schemas";
import { ActionButton } from "@/components/ui/Button";

interface ActivityIntroProps {
  activity: Activity;
  onStart: () => void;
}

export function ActivityIntro({ activity, onStart }: ActivityIntroProps) {
  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        Actividad
      </h2>
      <div className="mt-6 grid gap-8 border border-line bg-surface p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
        <div>
          <h3 className="font-accent text-3xl italic text-primary">{activity.title}</h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{activity.description}</p>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-foreground">
            <li>{activity.questions.length} preguntas</li>
            <li>Opción múltiple</li>
            <li>Aprobás con {activity.passingScore} o más</li>
          </ul>
        </div>
        <ActionButton onClick={onStart}>Empezar actividad</ActionButton>
      </div>
    </div>
  );
}
