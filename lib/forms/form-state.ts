export interface FormState {
  status: "idle" | "error" | "success";
  message: string;
}

export const idleFormState: FormState = { status: "idle", message: "" };

export function errorState(message: string): FormState {
  return { status: "error", message };
}

export function successState(message: string): FormState {
  return { status: "success", message };
}
