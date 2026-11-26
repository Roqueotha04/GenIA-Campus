import { CampusHeader } from "@/components/layout/CampusHeader";
import { Footer } from "@/components/layout/Footer";
import { CurrentProfileProvider } from "@/components/providers/CurrentProfileProvider";
import { requireProfile } from "@/lib/auth/current-profile";

export default async function CampusLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const profile = await requireProfile();

  return (
    <CurrentProfileProvider profile={profile}>
      <CampusHeader profile={profile} />
      <main className="min-h-[70vh]">{children}</main>
      <Footer />
    </CurrentProfileProvider>
  );
}
