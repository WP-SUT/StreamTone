import Link from "next/link";
import { Plus } from "lucide-react";

interface AddButtonProps {
  href: string;
  ariaLabel?: string;
  size?: number;
  className?: string;
}

export function AddButton({
  href,
  ariaLabel = "Add",
  size = 16,
  className = "w-9 h-9",
}: AddButtonProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      onClick={(e) => e.stopPropagation()}
      className={`
        flex items-center justify-center
        ${className} rounded-full
        bg-primary text-white shadow-lg
        hover:scale-110 active:scale-95
        transition-transform duration-150
      `}
    >
      <Plus size={size} />
    </Link>
  );
}
