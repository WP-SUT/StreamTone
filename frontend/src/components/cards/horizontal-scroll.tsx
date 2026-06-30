import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalScrollRowProps {
  children: React.ReactNode;
}

export default function HorizontalScrollRow({
  children,
}: HorizontalScrollRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({
      left: dir === "right" ? 300 : -300,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="
          hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10
          items-center justify-center
          w-8 h-8 rounded-full bg-black/70 text-white
          opacity-0 group-hover:opacity-100 transition-opacity
          -translate-x-1/2
        "
      >
        <ChevronLeft size={18} />
      </button>

      {/* Scroll container */}
      <div
        ref={rowRef}
        className="
          flex gap-3 sm:gap-4
          overflow-x-auto scroll-smooth
          pb-2 scrollbar-hide
        "
      >
        {children}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="
          hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10
          items-center justify-center
          w-8 h-8 rounded-full bg-black/70 text-white
          opacity-0 group-hover:opacity-100 transition-opacity
          translate-x-1/2
        "
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
