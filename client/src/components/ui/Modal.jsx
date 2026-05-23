export default function Modal({ children, onClose, title, maxWidth = "max-w-2xl" }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`glass-card w-full ${maxWidth} max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-slide-up`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          {title && (
            <h2 className="text-xl font-bold text-[var(--text-color)] pr-8">{title}</h2>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto shrink-0 rounded-lg p-2 text-[var(--secondary-text)] hover:bg-[var(--hover-bg-color)] transition-colors"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
