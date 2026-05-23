import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { filesApiUrl } from "../../../config/api";
import DownloadFileView from "../../common/DownloadFileView";

const GuestDownload = () => {
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
        const res = await fetch(filesApiUrl(`/g/${shortCode}`), { signal: controller.signal });
        if (!res.ok) throw new Error("File not found");
        const data = await res.json();
        setFile(data);
        setIsProtected(data.isPasswordProtected);
        setPreviewUrl(data.previewUrl || null);
        setIsVerified(!data.isPasswordProtected);
        if (data.isPasswordProtected) toast.info("This file is password protected");
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "File not found");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFile();
    return () => controller.abort();
  }, [shortCode]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(filesApiUrl(`/g/${shortCode}/download`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isProtected && password ? { password } : {}),
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
      setFile((prev) => (prev ? { ...prev, downloadedContent: data.downloadedContent } : prev));
      toast.success("Download started");
    } catch (err) {
      toast.error(err.message || "Download failed");
    } finally {
      setDownloading(false);
    }
  };

  const verifyFile = async () => {
    if (!password) {
      toast.warn("Enter a password");
      return;
    }
    try {
      const res = await fetch(filesApiUrl("/verifyGuestFilePassword"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shortCode, password }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Unlocked — you can preview and download");
        setIsVerified(true);
        setPreviewUrl(result.previewUrl);
      } else {
        toast.error("Incorrect password");
      }
    } catch {
      toast.error("Verification failed");
    }
  };

  return (
    <DownloadFileView
      file={file}
      error={error}
      isLoading={isLoading}
      isProtected={isProtected}
      isVerified={isVerified}
      password={password}
      setPassword={setPassword}
      previewUrl={previewUrl}
      downloading={downloading}
      onVerify={verifyFile}
      onDownload={handleDownload}
    />
  );
};

export default GuestDownload;
