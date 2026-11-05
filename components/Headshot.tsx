import Image from "next/image";
import { FOUNDER } from "@/lib/site";

// Tyler's photo. Served through next/image, so browsers get WebP/AVIF at the
// displayed size. `portrait` uses the 4:5 crop (hero on wide screens).
export default function Headshot({
  size = 160,
  portrait = false,
  className = "",
  priority = false,
}: {
  size?: number;
  portrait?: boolean;
  className?: string;
  priority?: boolean;
}) {
  const src = portrait ? FOUNDER.headshotPortrait : FOUNDER.headshot;
  const width = size;
  const height = portrait ? Math.round(size * (1186 / 960)) : size;
  return (
    <Image
      src={src}
      alt={`${FOUNDER.name}, founder of Sacramento AI Agency`}
      width={width}
      height={height}
      sizes={`${width}px`}
      priority={priority}
      className={`rounded-2xl object-cover border border-border shrink-0 ${className}`}
    />
  );
}
