type FormAlertTone = "error" | "success";

const toneClasses: Record<FormAlertTone, string> = {
  error: "border-danger text-danger",
  success: "border-success text-success",
};

interface FormAlertProps {
  tone: FormAlertTone;
  message: string;
}

export function FormAlert({ tone, message }: FormAlertProps) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`border-l-2 pl-3 text-sm ${toneClasses[tone]}`}
    >
      {message}
    </p>
  );
}
