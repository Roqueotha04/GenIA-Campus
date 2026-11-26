"use client";

import { CreationPanel } from "./CreationPanel";
import { useCreationPanel } from "./CreationPanelProvider";
import { UserCreateForm } from "./UserCreateForm";

export function UserCreationPanel() {
  const { completeCreation } = useCreationPanel();

  return (
    <CreationPanel title="Nuevo usuario">
      <UserCreateForm onSuccess={completeCreation} />
    </CreationPanel>
  );
}
