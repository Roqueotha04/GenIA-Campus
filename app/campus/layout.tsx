import { RequireSession } from "@/components/layout/RequireSession";
import { CampusHeader } from "@/components/layout/CampusHeader";
import { Footer } from "@/components/layout/Footer";

export default function CampusLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <RequireSession>
      <CampusHeader />
      <main className="min-h-[70vh]">{children}</main>
      <Footer />
    </RequireSession>
  );
}
