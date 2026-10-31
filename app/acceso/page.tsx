import type { Metadata } from "next";
import { LoginView } from "@/components/campus/LoginView";

export const metadata: Metadata = { title: "Acceso" };

export default function AccessPage() {
  return <LoginView />;
}
