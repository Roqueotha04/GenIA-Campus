import type { ComponentProps, ReactNode } from "react";
import { Breadcrumb } from "@/components/campus/Breadcrumb";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface AdminPageProps {
  breadcrumb: ComponentProps<typeof Breadcrumb>["items"];
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function AdminPage({ breadcrumb, title, subtitle, children }: AdminPageProps) {
  return (
    <Section className="py-10 md:py-14">
      <Breadcrumb items={breadcrumb} />
      <SectionHeading level={1} eyebrow="Administración" title={title} subtitle={subtitle} />
      <div className="mt-10 space-y-8 md:mt-12">{children}</div>
    </Section>
  );
}
