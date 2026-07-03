import Image from "next/image";
import Link from "next/link";
import { Music2 } from "lucide-react";
import { Card } from "@/components/ui/card";

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
      <Card
        className="glass relative rounded-xl overflow-hidden aspect-square p-0 shadow-none ring-0
          transition-shadow duration-300 group-hover:[box-shadow:0_0_20px_hsl(263_85%_65%/0.35)]"
      >
        <Link href={href} className="absolute inset-0 block">
          {cover ? (
            <Image
              src={cover}
              alt={coverAlt}
              fill
              sizes="(max-width: 640px) 144px, (max-width: 768px) 160px, 176px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Music2 className="h-10 w-10 text-white/30" />
            </div>
          )}

          {overlay && (
            <div className="absolute inset-0 flex items-end justify-end p-2 gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
              {overlay}
            </div>
          )}
        </Link>
      </Card>

      {/* Info */}
      <div className="flex flex-col gap-0.5 px-0.5">
        <Link
          href={href}
          className="text-gradient text-sm font-semibold truncate hover:opacity-80 transition-opacity leading-tight"
          title={title}
        >
          {title}
        </Link>

        {subtitle && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
            {subtitle}
          </div>
        )}

        {extra}
      </div>
    </div>
  );
}
