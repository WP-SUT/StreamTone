import { calculateProgress } from "@/lib/player/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  onSeek: (time: number) => void;
  accentColor?: string;
  className?: string;
}

export default function ProgressBar({
  current,
  total,
  onSeek,
  accentColor = "hsl(263, 85%, 65%)",
  className = "",
}: ProgressBarProps) {
  const progressPercent = calculateProgress(current, total);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    onSeek(position * total);
  };

  return (
    <div
      className={`relative w-full h-1.5 rounded-full bg-white/20 cursor-pointer ${className}`}
      onClick={handleClick}
      role="slider"
      aria-label="Seek"aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={current}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all"
        style={{ width: `${progressPercent}%`, backgroundColor: accentColor }}
      />
    </div>
  );
}
