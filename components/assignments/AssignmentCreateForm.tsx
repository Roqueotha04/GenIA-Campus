"use client";

import { AssignmentForm } from "./AssignmentForm";

interface AssignmentCreateFormProps {
  sectionId: string;
  onCreated?: () => void;
}

export function AssignmentCreateForm({ sectionId, onCreated }: AssignmentCreateFormProps) {
  return <AssignmentForm sectionId={sectionId} onSaved={onCreated} />;
}
