import "server-only";
import type { z } from "zod";
import { errorState, type FormState } from "@/lib/forms/form-state";

export type ParsedForm<Output> = { valid: true; data: Output } | { valid: false; state: FormState };

export function parseInput<Schema extends z.ZodType>(
  schema: Schema,
  input: unknown,
): ParsedForm<z.output<Schema>> {
  const result = schema.safeParse(input);
  if (result.success) return { valid: true, data: result.data };
  const message = result.error.issues[0]?.message ?? "Revisá los datos e intentá de nuevo.";
  return { valid: false, state: errorState(message) };
}

export function parseForm<Schema extends z.ZodType>(
  schema: Schema,
  formData: FormData,
): ParsedForm<z.output<Schema>> {
  return parseInput(schema, Object.fromEntries(formData));
}
