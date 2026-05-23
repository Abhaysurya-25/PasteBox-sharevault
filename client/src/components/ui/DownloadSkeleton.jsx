export default function DownloadSkeleton() {
  return (
    <div className="glass-card p-6 sm:p-8 animate-fade-in">
      <div className="skeleton h-6 w-2/3 mb-6" />
      <div className="skeleton h-64 w-full mb-6 rounded-xl" />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}
