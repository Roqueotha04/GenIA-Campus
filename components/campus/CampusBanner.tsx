import { Logo } from "@/components/ui/Logo";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface CampusBannerProps {
  greeting: string;
  message: string;
}

export function CampusBanner({ greeting, message }: CampusBannerProps) {
  return (
    <div className="surface-dark flex flex-col gap-4 rounded-sm bg-navy p-5 md:flex-row md:items-center md:justify-between md:p-6">
      <SectionHeading level={1} tone="onDark" title={greeting} subtitle={message} />
      <Logo className="h-5 shrink-0" />
    </div>
  );
}
