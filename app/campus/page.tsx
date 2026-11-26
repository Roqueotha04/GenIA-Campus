import type { Metadata } from "next";
import { CampusHome } from "@/components/campus/CampusHome";
import { requireProfile } from "@/lib/auth/current-profile";
import { listMyCourses } from "@/lib/course-content/my-courses-queries";

export const metadata: Metadata = { title: "Campus" };

export default async function CampusPage() {
  const profile = await requireProfile();
  const myCourses = await listMyCourses(profile);
  return <CampusHome profile={profile} myCourses={myCourses} />;
}
