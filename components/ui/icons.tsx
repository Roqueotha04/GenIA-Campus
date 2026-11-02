interface IconProps {
  className?: string;
}

interface StrokeIconProps extends IconProps {
  path: string;
}

function StrokeIcon({ className = "h-5 w-5", path }: StrokeIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d={path} />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return <StrokeIcon className={className} path="M5 12h14M13 6l6 6-6 6" />;
}

export function ArrowLeftIcon({ className }: IconProps) {
  return <StrokeIcon className={className} path="M19 12H5M11 6l-6 6 6 6" />;
}

export function CheckIcon({ className }: IconProps) {
  return <StrokeIcon className={className} path="M5 12.5l4.5 4.5L19 7.5" />;
}

export function CloseIcon({ className }: IconProps) {
  return <StrokeIcon className={className} path="M6 6l12 12M18 6L6 18" />;
}

export function FileIcon({ className }: IconProps) {
  return (
    <StrokeIcon
      className={className}
      path="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6"
    />
  );
}

export function DownloadIcon({ className }: IconProps) {
  return <StrokeIcon className={className} path="M12 4v11M7 11l5 5 5-5M5 20h14" />;
}

export function ChevronDownIcon({ className }: IconProps) {
  return <StrokeIcon className={className} path="M6 9l6 6 6-6" />;
}

export function PresentationIcon({ className }: IconProps) {
  return <StrokeIcon className={className} path="M3 4h18v12H3zM12 16v4M8 20h8" />;
}

export function GameIcon({ className }: IconProps) {
  return (
    <StrokeIcon
      className={className}
      path="M6 8h12a4 4 0 0 1 4 4v3a2 2 0 0 1-3.4 1.4L16 14H8l-2.6 2.4A2 2 0 0 1 2 15v-3a4 4 0 0 1 4-4zM7 10.5v3M5.5 12h3"
    />
  );
}

export function QuizIcon({ className }: IconProps) {
  return (
    <StrokeIcon
      className={className}
      path="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1zM8 6H6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-2M9 12h6M9 16h6"
    />
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <StrokeIcon
      className={className}
      path="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12zM8.5 10h7M8.5 13.5h4"
    />
  );
}

export function InstagramIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
