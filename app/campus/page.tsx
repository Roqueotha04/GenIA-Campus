import type { Metadata } from "next";
import { CampusHome } from "@/components/campus/CampusHome";

export const metadata: Metadata = { title: "Campus" };

export default function CampusPage() {
  return <CampusHome />;
}
