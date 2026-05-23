export default function Modal({
  children,
  onClose,
  title,
  subtitle,
  maxWidth = "max-w-2xl",
  showFooterClose = true,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        className={`glass-card relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-slide-up`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-color)] shadow-md hover:bg-[var(--hover-bg-color)] transition-colors"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {(title || subtitle) && (
          <div className="pr-12 mb-6">
            {title && (
              <h2 id="modal-title" className="text-xl font-bold text-[var(--text-color)]">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-[var(--secondary-text)] break-all">
                &ldquo;{subtitle}&rdquo;
              </p>
            )}
          </div>
        )}

        {children}

        {showFooterClose && onClose && (
          <div className="mt-8 pt-4 border-t border-[var(--border-color)]">
            <button type="button" onClick={onClose} className="btn-secondary w-full py-2.5">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
