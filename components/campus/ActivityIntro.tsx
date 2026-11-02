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
      <div className="mt-6 grid gap-10 border border-line bg-surface p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12">
        <div>
          <h3 className="font-accent text-4xl italic text-primary">{activity.title}</h3>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{activity.description}</p>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-base text-foreground">
            <li>{activity.questions.length} preguntas</li>
            <li>Verdadero o falso, opción múltiple y respuesta escrita</li>
            <li>Aprobás con {activity.passingScore} o más</li>
          </ul>
        </div>
        <ActionButton onClick={onStart}>Empezar actividad</ActionButton>
      </div>
    </div>
  );
}
