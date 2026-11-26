import { requireRole } from "@/lib/auth/current-profile";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireRole("admin");
  return <>{children}</>;
}
