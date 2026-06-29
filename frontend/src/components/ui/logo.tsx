// src/components/logo.tsx
import { Music2 } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showGlow?: boolean;
  iconOnly?: boolean;
}

export function Logo({ size = "md", showGlow = true, iconOnly = false }: LogoProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-10 h-10",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  const icon = (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-2xl bg-primary/20 border border-primary/30
        flex items-center justify-center shrink-0
        ${showGlow ? "glow-primary" : ""}
      `}
    >
      <Music2 className={`${iconSizes[size]} text-primary`} />
    </div>
  );

  if (iconOnly) return icon;

  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className={`${textSizes[size]} font-semibold text-white tracking-tight`}>
        StreamTone
      </span>
    </div>
  );
}
