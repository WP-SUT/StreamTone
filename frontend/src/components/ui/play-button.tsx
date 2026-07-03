import { Play } from "lucide-react";

interface PlayButtonProps {
  onClick: (e: React.MouseEvent) => void;
  ariaLabel?: string;
  size?: number;
  className?: string;
}

export function PlayButton({
  onClick,
  ariaLabel = "Play",
  size = 16,
  className = "w-9 h-9",
}: PlayButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      className={`
        flex items-center justify-center
        ${className} rounded-full
        bg-primary text-white shadow-lg
        hover:scale-110 active:scale-95
        transition-transform duration-150
      `}
    >
      <Play size={size} fill="currentColor" />
    </button>
  );
}
