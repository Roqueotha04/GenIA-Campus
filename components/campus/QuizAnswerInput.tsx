import type { Question } from "@/data/schemas";
import type { QuizAnswer } from "@/lib/quiz-scoring";
import { QuizChoiceInput } from "./QuizChoiceInput";
import { QuizWrittenInput } from "./QuizWrittenInput";

const trueFalseOptions = ["Verdadero", "Falso"];

interface QuizAnswerInputProps {
  question: Question;
  answer: QuizAnswer | null;
  onChange: (answer: QuizAnswer | null) => void;
}

function toggleIndex(selectedIndices: number[], index: number): number[] {
  return selectedIndices.includes(index)
    ? selectedIndices.filter((selectedIndex) => selectedIndex !== index)
    : [...selectedIndices, index];
}

export function QuizAnswerInput({ question, answer, onChange }: QuizAnswerInputProps) {
  switch (question.kind) {
    case "true-false":
      return (
        <QuizChoiceInput
          name={question.id}
          options={trueFalseOptions}
          selectedIndices={typeof answer === "boolean" ? [answer ? 0 : 1] : []}
          allowMultiple={false}
          onToggle={(optionIndex) => onChange(optionIndex === 0)}
        />
      );
    case "single-choice":
      return (
        <QuizChoiceInput
          name={question.id}
          options={question.options}
          selectedIndices={typeof answer === "number" ? [answer] : []}
          allowMultiple={false}
          onToggle={onChange}
        />
      );
    case "multiple-choice": {
      const selectedIndices = Array.isArray(answer) ? answer : [];
      return (
        <QuizChoiceInput
          name={question.id}
          options={question.options}
          selectedIndices={selectedIndices}
          allowMultiple
          onToggle={(optionIndex) => {
            const nextIndices = toggleIndex(selectedIndices, optionIndex);
            onChange(nextIndices.length > 0 ? nextIndices : null);
          }}
        />
      );
    }
    case "written":
      return (
        <QuizWrittenInput
          value={typeof answer === "string" ? answer : ""}
          onChange={(text) => onChange(text.trim() === "" ? null : text)}
        />
      );
  }
}
