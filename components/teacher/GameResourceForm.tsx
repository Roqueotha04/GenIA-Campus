import { SelectField } from "@/components/ui/SelectField";
import { registeredGames } from "@/data/games";
import { createGameResourceAction } from "@/lib/teacher/resource-actions";
import { ActionForm } from "./ActionForm";

const gameOptions = registeredGames.map((game) => ({ value: game.slug, label: game.title }));

export function GameResourceForm({ sectionId }: { sectionId: string }) {
  return (
    <ActionForm
      action={createGameResourceAction}
      hiddenFields={{ sectionId }}
      submitLabel="Agregar juego"
      pendingLabel="Agregando…"
    >
      <SelectField label="Juego" name="gameSlug" options={gameOptions} required />
    </ActionForm>
  );
}
