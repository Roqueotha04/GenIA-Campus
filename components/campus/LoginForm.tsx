"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ActionButton } from "@/components/ui/Button";
import { useSession } from "@/hooks/useSession";
import { DemoAccounts } from "./DemoAccounts";
import { TextField } from "./TextField";

const INVALID_CREDENTIALS_MESSAGE = "El email o la clave no coinciden. Revisalos e intentá de nuevo.";

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const succeeded = signIn(email, password);
    if (succeeded) {
      router.replace("/campus");
      return;
    }
    setErrorMessage(INVALID_CREDENTIALS_MESSAGE);
  };

  const fillCredentials = (nextEmail: string, nextPassword: string) => {
    setEmail(nextEmail);
    setPassword(nextPassword);
    setErrorMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
      />
      <TextField
        label="Clave"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={setPassword}
      />
      {errorMessage && (
        <p role="alert" className="border-l-2 border-danger pl-3 text-sm text-danger">
          {errorMessage}
        </p>
      )}
      <ActionButton type="submit" disabled={!email || !password} className="w-full">
        Ingresar
      </ActionButton>
      <DemoAccounts onSelect={fillCredentials} />
    </form>
  );
}
