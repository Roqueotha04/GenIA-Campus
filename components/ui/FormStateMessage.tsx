import type { FormState } from "@/lib/forms/form-state";
import { FormAlert } from "./FormAlert";

export function FormStateMessage({ state }: { state: FormState }) {
  if (state.status === "idle") return null;
  return <FormAlert tone={state.status} message={state.message} />;
}
