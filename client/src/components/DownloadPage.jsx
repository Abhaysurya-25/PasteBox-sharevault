import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { filesApiUrl } from "../config/api";

const FilePreviewContent = ({ file, previewUrl }) => {
  if (!previewUrl) return null;

  if (file.type.startsWith("image/")) {
    return (
      <img src={previewUrl} alt={file.name} className="w-full h-auto rounded mb-4" />
    );
  }
  if (file.type.startsWith("video/")) {
    return (
      <video controls className="w-full h-auto rounded mb-4">
        <source src={previewUrl} type={file.type} />
      </video>
    );
  }
  if (file.type.startsWith("audio/")) {
    return (
      <audio controls className="w-full h-auto rounded mb-4">
        <source src={previewUrl} type={file.type} />
      </audio>
    );
  }
  if (file.type === "application/pdf") {
    return (
      <iframe
        src={previewUrl}
        title="PDF Preview"
        className="w-full h-[400px] rounded mb-4"
      />
    );
  }
  return null;
};

const DownloadPage = () => {
  const { shortCode } = useParams();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isProtected, setIsProtected] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchFile = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(filesApiUrl(`/f/${shortCode}`), {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("File not found");

        const data = await res.json();
        setFile(data);
        setIsProtected(data.isPasswordProtected);
        setPreviewUrl(data.previewUrl || null);
        setIsVerified(!data.isPasswordProtected);
        setIsLoading(false);

        if (data.isPasswordProtected) {
          toast.info("This file is password protected. Please enter the password.");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "File not found");
          setIsLoading(false);
        }
      }
    };

    fetchFile();
    return () => controller.abort();
  }, [shortCode]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(filesApiUrl(`/f/${shortCode}/download`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isProtected && password ? { password } : {}
        ),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Download failed");
      }

      const data = await res.json();
      const link = document.createElement("a");
      link.href = data.downloadUrl;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setFile((prev) =>
        prev ? { ...prev, downloadedContent: data.downloadedContent } : prev
      );
      toast.success("Download started");
    } catch (err) {
      toast.error(err.message || "Download failed");
    } finally {
      setDownloading(false);
    }
  };

  const verifyFile = async () => {
    if (!password) {
      toast.warn("Please enter a password.");
      return;
    }

    try {
      const res = await fetch(filesApiUrl("/verifyFilePassword"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shortCode, password }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Password verified! You can now preview and download the file.");
        setIsVerified(true);
        setPreviewUrl(result.previewUrl);
      } else {
        toast.error("Incorrect password. Try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (error) {
    return <div className="text-red-500 p-6 text-center">{error}</div>;
  }
  if (isLoading || !file) {
    return <div className="text-gray-500 p-6 text-center">Loading...</div>;
  }

  const canAccess = !isProtected || isVerified;

  return (
    <div className="w-full max-w-screen-lg mx-auto bg-[var(--bg-color)] rounded shadow-md p-4 sm:p-6 flex flex-col gap-6 lg:flex-row">
      <div className="w-full lg:w-2/3 flex flex-col gap-4">
        <p className="text-[var(--text-color)] text-sm sm:text-base">
          <strong>File Name:</strong> {file.name}
        </p>
        <div className="w-full">
          <h2 className="text-lg font-semibold text-[var(--primary-text)] mb-2">
            File Preview
          </h2>

          {!canAccess ? (
            <div className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-400 p-6 rounded bg-gray-100 dark:bg-gray-800 text-center">
              <p className="text-gray-700 dark:text-gray-200 text-base">
                This file is password protected. Please verify to preview or download.
              </p>
            </div>
          ) : (
            <FilePreviewContent file={file} previewUrl={previewUrl} />
          )}
        </div>

        <p className="text-[var(--text-color)] text-sm">
          <strong>Uploaded by:</strong> {file.uploadedBy}
        </p>
      </div>

      <div className="w-full lg:w-1/3 flex flex-col gap-3 justify-start">
        <p className="text-[var(--text-color)] text-sm sm:text-base">
          <strong>Uploaded on:</strong>{" "}
          {new Date(file.createdAt).toLocaleDateString()}
        </p>
        <p className="text-[var(--text-color)] text-sm sm:text-base">
          <strong>File Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
        <p className="text-[var(--text-color)] text-sm sm:text-base">
          <strong>File Type:</strong> {file.type}
        </p>

        {isProtected && !isVerified && (
          <>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border rounded bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={verifyFile}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Verify Password
            </button>
          </>
        )}

        {canAccess && (
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="mt-4 w-full bg-green-600 text-white text-center px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60"
          >
            {downloading ? "Preparing download..." : "Download"}
          </button>
        )}
      </div>
    </div>
  );
};

export default DownloadPage;
