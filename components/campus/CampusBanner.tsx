import { Logo } from "@/components/ui/Logo";

interface CampusBannerProps {
  greeting: string;
  message: string;
}

export function CampusBanner({ greeting, message }: CampusBannerProps) {
  return (
    <div className="surface-dark flex flex-col gap-8 rounded-sm bg-navy p-8 text-white md:flex-row md:items-end md:justify-between md:p-12">
      <div>
        <p className="font-accent text-3xl italic text-cyan md:text-4xl">{greeting}</p>
        <p className="mt-3 max-w-md text-base leading-relaxed text-white/70">{message}</p>
      </div>
      <Logo className="h-5 shrink-0 md:h-6" />
    </div>
  );
}
