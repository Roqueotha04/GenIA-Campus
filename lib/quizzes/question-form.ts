import "server-only";
import { questionSchema, type Question } from "@/data/schemas";

export type ParsedQuestion = { valid: true; question: Question } | { valid: false; message: string };

const SINGLE_CHOICE_OPTION_COUNT = 4;
const MAX_OPTION_COUNT = 6;
const MIN_MULTIPLE_CHOICE_OPTIONS = 4;
const MIN_MULTIPLE_CHOICE_CORRECT = 2;
const QUESTION_KINDS = ["true-false", "single-choice", "multiple-choice", "written"] as const;

type QuestionKind = (typeof QUESTION_KINDS)[number];

interface QuestionBase {
  id: string;
  prompt: string;
  explanation: string;
}

type BuiltQuestion = { ok: true; value: unknown } | { ok: false; message: string };

const failure = (message: string): BuiltQuestion => ({ ok: false, message });

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function isQuestionKind(value: string): value is QuestionKind {
  return QUESTION_KINDS.some((kind) => kind === value);
}

function hasRepeatedText(texts: string[]): boolean {
  return new Set(texts.map((text) => text.toLowerCase())).size !== texts.length;
}

function buildTrueFalse(formData: FormData, base: QuestionBase): BuiltQuestion {
  return { ok: true, value: { ...base, kind: "true-false", correct: readText(formData, "correct") === "true" } };
}

function buildSingleChoice(formData: FormData, base: QuestionBase): BuiltQuestion {
  const options = Array.from({ length: SINGLE_CHOICE_OPTION_COUNT }, (_, index) =>
    readText(formData, `option${index}`),
  );
  if (options.some((option) => option === "")) return failure("Completá las 4 opciones de la pregunta.");
  if (hasRepeatedText(options)) return failure("Las opciones no pueden repetirse.");

  const correctIndex = Number(readText(formData, "correctIndex"));
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= SINGLE_CHOICE_OPTION_COUNT) {
    return failure("Marcá cuál es la opción correcta.");
  }
  return { ok: true, value: { ...base, kind: "single-choice", options, correctIndex } };
}

function buildMultipleChoice(formData: FormData, base: QuestionBase): BuiltQuestion {
  const slots = Array.from({ length: MAX_OPTION_COUNT }, (_, index) => ({
    text: readText(formData, `option${index}`),
    isCorrect: formData.get(`correct${index}`) === "on",
  }));
  if (slots.some((slot) => slot.text === "" && slot.isCorrect)) {
    return failure("Marcaste como correcta una opción vacía. Escribí su texto o desmarcala.");
  }

  const filledSlots = slots.filter((slot) => slot.text !== "");
  if (filledSlots.length < MIN_MULTIPLE_CHOICE_OPTIONS) {
    return failure("Completá al menos 4 opciones de la pregunta.");
  }
  const options = filledSlots.map((slot) => slot.text);
  if (hasRepeatedText(options)) return failure("Las opciones no pueden repetirse.");

  const correctIndices = filledSlots.flatMap((slot, index) => (slot.isCorrect ? [index] : []));
  if (correctIndices.length < MIN_MULTIPLE_CHOICE_CORRECT) {
    return failure("Marcá al menos 2 opciones correctas.");
  }
  return { ok: true, value: { ...base, kind: "multiple-choice", options, correctIndices } };
}

function parseKeywordGroups(rawGroups: string): string[][] {
  return rawGroups
    .split("\n")
    .map((line) =>
      line
        .split(",")
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword !== ""),
    )
    .filter((group) => group.length > 0);
}

function buildWritten(formData: FormData, base: QuestionBase): BuiltQuestion {
  const expectedAnswer = readText(formData, "expectedAnswer");
  if (expectedAnswer === "") return failure("Escribí la respuesta esperada para mostrarla al revisar.");

  const keywordGroups = parseKeywordGroups(readText(formData, "keywordGroups"));
  if (keywordGroups.length === 0) {
    return failure("Cargá al menos un grupo de palabras clave, uno por línea y con sinónimos separados por coma.");
  }
  return { ok: true, value: { ...base, kind: "written", expectedAnswer, keywordGroups } };
}

const builders: Record<QuestionKind, (formData: FormData, base: QuestionBase) => BuiltQuestion> = {
  "true-false": buildTrueFalse,
  "single-choice": buildSingleChoice,
  "multiple-choice": buildMultipleChoice,
  written: buildWritten,
};

export function parseQuestionForm(formData: FormData, questionId: string): ParsedQuestion {
  const kind = readText(formData, "kind");
  if (!isQuestionKind(kind)) return { valid: false, message: "Elegí un tipo de pregunta." };

  const prompt = readText(formData, "prompt");
  if (prompt === "") return { valid: false, message: "Escribí el enunciado de la pregunta." };

  const explanation = readText(formData, "explanation");
  if (explanation === "") {
    return { valid: false, message: "Escribí la explicación que verá el alumno al revisar sus respuestas." };
  }

  const built = builders[kind](formData, { id: questionId, prompt, explanation });
  if (!built.ok) return { valid: false, message: built.message };

  const validation = questionSchema.safeParse(built.value);
  if (!validation.success) {
    return { valid: false, message: "La pregunta tiene datos inválidos. Revisá los campos e intentá de nuevo." };
  }
  return { valid: true, question: validation.data };
}
