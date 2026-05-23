const stats = [
  { value: "10MB", label: "Max file size" },
  { value: "S3", label: "Cloud storage" },
  { value: "24/7", label: "Link availability" },
  { value: "100%", label: "Free to start" },
];

export default function LandingStats() {
  return (
    <section className="py-16 bg-[var(--surface-muted)]/50 border-y border-[var(--border-color)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-[var(--primary-text)]">{s.value}</p>
              <p className="mt-1 text-sm text-[var(--secondary-text)] font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
