import { AdminShell } from "@/components/admin/AdminShell";
import { requireRole } from "@/lib/auth/current-profile";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireRole("admin");
  return <AdminShell>{children}</AdminShell>;
}
