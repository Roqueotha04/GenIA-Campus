"use client";

import { FormAlert } from "@/components/ui/FormAlert";
import { useCreationPanel } from "./CreationPanelProvider";

export function CreationSuccessAlert() {
  const { successMessage } = useCreationPanel();
  if (!successMessage) return null;
  return <FormAlert tone="success" message={successMessage} />;
}
