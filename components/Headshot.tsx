import { FOUNDER } from "@/lib/site";

// Tyler's photo, or a marked placeholder until public/tyler-headshot.jpg exists
// (set FOUNDER.headshot in lib/site.ts).
export default function Headshot({ size = 160, className = "" }: { size?: number; className?: string }) {
  const style = { width: size, height: size };
  if (FOUNDER.headshot) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={FOUNDER.headshot}
        alt={`${FOUNDER.name}, founder of Sacramento AI Agency`}
        width={size}
        height={size}
        style={style}
        className={`rounded-2xl object-cover border border-border shrink-0 ${className}`}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`Photo of ${FOUNDER.name} coming soon`}
      style={style}
      className={`rounded-2xl border-2 border-dashed border-amber-500 bg-amber-50 flex flex-col items-center justify-center text-center shrink-0 ${className}`}
    >
      <span className="text-3xl font-black text-ink/30">TC</span>
      <span className="mt-1 px-2 font-mono text-[10px] leading-tight text-amber-800">
        TODO: tyler-headshot.jpg
      </span>
    </div>
  );
}
