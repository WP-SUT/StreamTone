import Image from "next/image";
import Link from "next/link";
import { Music2 } from "lucide-react";

interface MediaCardProps {
  href: string;
  cover?: string;
  coverAlt: string;
  title: string;
  overlay?: React.ReactNode;
  subtitle?: React.ReactNode;
  extra?: React.ReactNode;
}

export default function MediaCard({
  href,
  cover,
  coverAlt,
  title,
  overlay,
  subtitle,
  extra,
}: MediaCardProps) {
  return (
    <div className="group flex flex-col gap-2 w-36 sm:w-40 md:w-44 shrink-0">
      {/* Cover */}
      <Link
        href={href}
        className="relative block rounded-xl overflow-hidden aspect-square bg-neutral-800"
      >
        {cover ? (
          <Image
            src={cover}
            alt={coverAlt}
            fill
            sizes="(max-width: 640px) 144px, (max-width: 768px) 160px, 176px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/10">
            <Music2 className="h-10 w-10 text-white/30" />
          </div>
        )}

        {overlay && (
          <div className="absolute inset-0 flex items-end justify-end p-2 gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
            {overlay}
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-0.5 px-0.5">
        <Link
          href={href}
          className="text-sm font-semibold text-white truncate hover:underline leading-tight"
          title={title}
        >
          {title}
        </Link>

        {subtitle && (
          <div className="flex items-center gap-1 text-xs text-neutral-400 truncate">
            {subtitle}
          </div>
        )}

        {extra}
      </div>
    </div>
  );
}
