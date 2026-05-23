import { differenceInDays, formatDistanceToNowStrict } from "date-fns";
import { FaDownload, FaLock, FaFileAlt } from "react-icons/fa";
import DownloadSkeleton from "../ui/DownloadSkeleton";
import EmptyState from "../ui/EmptyState";

const FilePreviewContent = ({ file, previewUrl }) => {
  if (!previewUrl) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-color)] py-16 text-[var(--secondary-text)]">
        <FaFileAlt className="text-4xl mb-3 opacity-50" />
        <p>Preview not available for this file type</p>
      </div>
    );
  }
  if (file.type?.startsWith("image/")) {
    return <img src={previewUrl} alt={file.name} className="w-full rounded-xl shadow-soft max-h-[420px] object-contain bg-[var(--surface-muted)]" />;
  }
  if (file.type?.startsWith("video/")) {
    return (
      <video controls className="w-full rounded-xl max-h-[420px] bg-black">
        <source src={previewUrl} type={file.type} />
      </video>
    );
  }
  if (file.type?.startsWith("audio/")) {
    return (
      <audio controls className="w-full">
        <source src={previewUrl} type={file.type} />
      </audio>
    );
  }
  if (file.type === "application/pdf") {
    return <iframe src={previewUrl} title="PDF" className="w-full h-[420px] rounded-xl border border-[var(--border-color)]" />;
  }
  return null;
};

export default function DownloadFileView({
  file,
  error,
  isLoading,
  isProtected,
  isVerified,
  password,
  setPassword,
  previewUrl,
  downloading,
  onVerify,
  onDownload,
}) {
  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="File unavailable"
        description={error}
      />
    );
  }
  if (isLoading || !file) return <DownloadSkeleton />;

  const canAccess = !isProtected || isVerified;
  const isExpired = file.expiresAt && differenceInDays(new Date(file.expiresAt), new Date()) <= 0;
  const sizeMb = (file.size / 1024 / 1024).toFixed(2);

  return (
    <div className="glass-card overflow-hidden animate-slide-up">
      <div className="border-b border-[var(--border-color)] px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--secondary-text)]">Shared file</p>
            <h1 className="mt-1 text-xl sm:text-2xl font-bold text-[var(--text-color)] break-all">{file.name}</h1>
          </div>
          <span className={isExpired ? "badge-danger" : "badge-success"}>
            {isExpired ? "Expired" : file.status || "Active"}
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--secondary-text)] uppercase tracking-wide">Preview</h2>
          {!canAccess ? (
            <div className="rounded-xl border-2 border-dashed border-[var(--border-color)] bg-[var(--surface-muted)]/30 p-10 text-center">
              <FaLock className="mx-auto text-3xl text-[var(--primary-text)] mb-4" />
              <p className="font-medium text-[var(--text-color)]">Password protected</p>
              <p className="text-sm text-[var(--secondary-text)] mt-2">Enter the password to preview and download</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="input-field max-w-xs mx-auto mt-6"
                onKeyDown={(e) => e.key === "Enter" && onVerify()}
              />
              <button type="button" onClick={onVerify} className="btn-primary mt-4">
                Unlock file
              </button>
            </div>
          ) : (
            <FilePreviewContent file={file} previewUrl={previewUrl} />
          )}
        </div>

        <aside className="lg:col-span-2 space-y-5">
          <div className="rounded-xl border border-[var(--border-color)] p-5 space-y-4 bg-[var(--surface-muted)]/30">
            <MetaRow label="Size" value={`${sizeMb} MB`} />
            <MetaRow label="Type" value={file.type || "—"} />
            <MetaRow label="Uploaded by" value={file.uploadedBy || "Guest"} />
            <MetaRow label="Uploaded" value={formatDistanceToNowStrict(new Date(file.createdAt), { addSuffix: true })} />
            {file.expiresAt && (
              <MetaRow
                label="Expires"
                value={
                  isExpired
                    ? "Expired"
                    : `In ${differenceInDays(new Date(file.expiresAt), new Date())} days`
                }
              />
            )}
            <MetaRow label="Downloads" value={String(file.downloadedContent ?? 0)} />
          </div>

          {canAccess && (
            <button
              type="button"
              onClick={onDownload}
              disabled={downloading || isExpired}
              className="btn-primary w-full py-3.5 text-base"
            >
              <FaDownload />
              {downloading ? "Preparing download..." : "Download file"}
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}

function MetaRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-[var(--secondary-text)]">{label}</span>
      <span className="font-medium text-[var(--text-color)] text-right">{value}</span>
    </div>
  );
}
