export default function EmptyState({ icon = "📂", title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--surface-muted)]/30 px-6 py-16 text-center animate-fade-in">
      <span className="text-5xl mb-4" aria-hidden>
        {icon}
      </span>
      <h3 className="text-lg font-semibold text-[var(--text-color)]">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-[var(--secondary-text)] max-w-sm">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
