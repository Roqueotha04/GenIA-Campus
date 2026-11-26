import { ActionButton } from "@/components/ui/Button";

interface ActivityIntroProps {
  title: string;
  description: string;
  questionCount: number;
  passingScore: number;
  onStart: () => void;
}

export function ActivityIntro({ title, description, questionCount, passingScore, onStart }: ActivityIntroProps) {
  return (
    <div>
      <h2 className="font-heading text-lg font-semibold text-foreground">
        Actividad
      </h2>
      <div className="mt-3 grid gap-5 border border-line bg-surface p-5 md:grid-cols-[1fr_auto] md:items-center md:p-6">
        <div>
          <h3 className="font-heading text-xl font-semibold text-foreground">{title}</h3>
          {description && <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{description}</p>}
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground">
            <li>{questionCount} preguntas</li>
            <li>Verdadero o falso, opción múltiple y respuesta escrita</li>
            <li>Aprobás con {passingScore} o más</li>
          </ul>
        </div>
        <ActionButton onClick={onStart}>Empezar actividad</ActionButton>
      </div>
    </div>
  );
}
