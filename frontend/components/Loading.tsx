export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="vintage-spinner mb-4"></div>
      <p className="text-[var(--primary)] font-sans uppercase tracking-wide text-sm">
        Loading wisdom...
      </p>
    </div>
  );
}
