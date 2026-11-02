import { QuizOption } from "./QuizOption";

const optionLetters = ["a", "b", "c", "d", "e", "f"];

interface QuizChoiceInputProps {
  name: string;
  options: string[];
  selectedIndices: number[];
  allowMultiple: boolean;
  onToggle: (optionIndex: number) => void;
}

export function QuizChoiceInput({
  name,
  options,
  selectedIndices,
  allowMultiple,
  onToggle,
}: QuizChoiceInputProps) {
  return (
    <div className="flex flex-col gap-4">
      {options.map((option, optionIndex) => (
        <QuizOption
          key={option}
          name={name}
          inputType={allowMultiple ? "checkbox" : "radio"}
          letter={optionLetters[optionIndex]}
          label={option}
          checked={selectedIndices.includes(optionIndex)}
          onSelect={() => onToggle(optionIndex)}
        />
      ))}
    </div>
  );
}
