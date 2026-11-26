"use client";

import type { SelectOption } from "@/components/ui/SelectField";
import { CourseCreateForm } from "./CourseCreateForm";
import { CreationPanel } from "./CreationPanel";
import { useCreationPanel } from "./CreationPanelProvider";

export function CourseCreationPanel({ moduleOptions }: { moduleOptions: SelectOption[] }) {
  const { completeCreation } = useCreationPanel();

  return (
    <CreationPanel title="Nuevo curso">
      <CourseCreateForm moduleOptions={moduleOptions} onSuccess={completeCreation} />
    </CreationPanel>
  );
}
