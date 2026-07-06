import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  href?: string;
  seeAllLabel?: string;
}

export default function SectionHeader({
  title,
  href,
  seeAllLabel = "See all",
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg sm:text-xl font-bold text-white truncate">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors shrink-0 ml-4"
        >
          {seeAllLabel}
        </Link>
      )}
    </div>
  );
}
