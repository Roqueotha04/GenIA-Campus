import type { Question } from "@/data/schemas";
import { SelectField } from "@/components/ui/SelectField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { ChoiceOptionField } from "./ChoiceOptionField";
import {
  defaultExpectedAnswer,
  defaultKeywordGroupsText,
  defaultOptionText,
  defaultTrueFalseAnswer,
  isDefaultCorrectOption,
} from "./question-defaults";

const SINGLE_CHOICE_OPTION_COUNT = 4;
const MULTIPLE_CHOICE_OPTION_COUNT = 6;

const trueFalseOptions = [
  { value: "true", label: "Verdadero" },
  { value: "false", label: "Falso" },
];

interface QuestionKindFieldsProps {
  kind: Question["kind"];
  question?: Question;
}

function ChoiceFields({ allowMultiple, question }: { allowMultiple: boolean; question?: Question }) {
  const optionCount = allowMultiple ? MULTIPLE_CHOICE_OPTION_COUNT : SINGLE_CHOICE_OPTION_COUNT;
  const hint = allowMultiple
    ? "Completá entre 4 y 6 opciones y marcá al menos 2 correctas. Las opciones vacías se ignoran."
    : "Completá las 4 opciones y marcá la correcta.";

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted">{hint}</p>
      {Array.from({ length: optionCount }, (_, index) => (
        <ChoiceOptionField
          key={index}
          index={index}
          allowMultiple={allowMultiple}
          defaultText={defaultOptionText(question, index)}
          defaultCorrect={isDefaultCorrectOption(question, index)}
        />
      ))}
    </div>
  );
}

function WrittenFields({ question }: { question?: Question }) {
  return (
    <div className="space-y-4">
      <TextAreaField
        label="Respuesta esperada"
        name="expectedAnswer"
        defaultValue={defaultExpectedAnswer(question)}
        rows={3}
        hint="Es lo que ve el alumno al revisar su intento."
      />
      <TextAreaField
        label="Grupos de palabras clave"
        name="keywordGroups"
        defaultValue={defaultKeywordGroupsText(question)}
        rows={4}
        hint="Un grupo por línea, con sinónimos separados por coma. La respuesta es correcta si menciona al menos una palabra de cada grupo."
      />
    </div>
  );
}

export function QuestionKindFields({ kind, question }: QuestionKindFieldsProps) {
  switch (kind) {
    case "true-false":
      return (
        <SelectField
          label="Respuesta correcta"
          name="correct"
          options={trueFalseOptions}
          defaultValue={defaultTrueFalseAnswer(question)}
        />
      );
    case "single-choice":
      return <ChoiceFields allowMultiple={false} question={question} />;
    case "multiple-choice":
      return <ChoiceFields allowMultiple question={question} />;
    case "written":
      return <WrittenFields question={question} />;
  }
}
