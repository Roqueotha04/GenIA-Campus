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
