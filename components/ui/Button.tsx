import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "outline" | "inverse" | "outlineOnDark";
type ButtonSize = "md" | "sm";

interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

interface LinkButtonProps extends ButtonStyleProps {
  href: string;
}

interface ActionButtonProps extends ButtonStyleProps {
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-sm font-semibold tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const sizeClasses: Record<ButtonSize, string> = {
  md: "h-12 px-6 text-sm",
  sm: "h-10 px-4 text-sm",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-navy",
  outline: "border border-navy/25 text-foreground hover:border-navy hover:bg-navy/5",
  inverse: "bg-white text-navy hover:bg-cyan",
  outlineOnDark: "border border-white/30 text-white hover:border-white hover:bg-white/10",
};

function buildClasses({ variant = "primary", size = "md", className = "" }: ButtonStyleProps) {
  return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
}

export function Button({ href, ...styleProps }: LinkButtonProps) {
  return (
    <Link href={href} className={buildClasses(styleProps)}>
      {styleProps.children}
    </Link>
  );
}

export function ActionButton({
  onClick,
  type = "button",
  disabled,
  ...styleProps
}: ActionButtonProps) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={buildClasses(styleProps)}>
      {styleProps.children}
    </button>
  );
}
