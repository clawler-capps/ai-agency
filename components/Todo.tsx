// A visible, clearly marked placeholder for content Tyler still has to supply.
// Search the repo for "<Todo" to find every one before going live.
export default function Todo({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      data-todo
      className={`inline-block rounded-md border border-dashed px-1.5 py-0.5 font-mono text-[11px] leading-snug align-middle ${
        dark ? "border-amber-300/60 bg-amber-300/10 text-amber-200" : "border-amber-500 bg-amber-50 text-amber-800"
      }`}
    >
      TODO: {children}
    </span>
  );
}
