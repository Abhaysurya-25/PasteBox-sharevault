export default function Spinner({ size = "md", className = "" }) {
  const sizes = { sm: "h-5 w-5", md: "h-8 w-8", lg: "h-12 w-12" };
  return (
    <div
      className={`${sizes[size]} animate-spin rounded-full border-2 border-[var(--primary-text)] border-t-transparent ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
