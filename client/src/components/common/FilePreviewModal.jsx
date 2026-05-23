import { useEffect, useState } from "react";
import axiosInstance from "../../config/axiosInstance";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";

const FilePreviewModal = ({ file, onClose, isGuest = false }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) return;
    const fileId = String(file._id || file.id || "").trim();
    if (!fileId || fileId === "undefined") {
      setError("File ID is missing");
      setLoading(false);
      return;
    }

    const loadPreview = async () => {
      setLoading(true);
      setError("");
      setPreviewUrl(null);
      try {
        const path = isGuest
          ? `/files/preview/guest/${fileId}`
          : `/files/preview/${fileId}`;
        const res = await axiosInstance.get(path);
        if (!res.data?.previewUrl) throw new Error("Preview unavailable");
        setPreviewUrl(res.data.previewUrl);
      } catch (err) {
        setError(err.response?.data?.error || "Could not load preview");
      } finally {
        setLoading(false);
      }
    };
    loadPreview();
  }, [file, isGuest]);

  if (!file) return null;

  const renderPreview = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center py-16 gap-3">
          <Spinner />
          <p className="text-sm text-[var(--secondary-text)]">Loading preview...</p>
        </div>
      );
    }
    if (error || !previewUrl) {
      return <p className="text-center text-red-500 py-8">{error || "Preview unavailable"}</p>;
    }
    if (file.type?.startsWith("image/")) {
      return <img src={previewUrl} alt={file.name} className="w-full rounded-xl max-h-[60vh] object-contain" />;
    }
    if (file.type?.startsWith("video/")) {
      return (
        <video controls className="w-full rounded-xl max-h-[60vh]">
          <source src={previewUrl} type={file.type} />
        </video>
      );
    }
    if (file.type === "application/pdf") {
      return <iframe src={previewUrl} title="PDF" className="w-full h-[60vh] rounded-xl border border-[var(--border-color)]" />;
    }
    return <p className="text-center text-[var(--secondary-text)] py-8">Preview not supported for this type</p>;
  };

  return (
    <Modal title={file.name} onClose={onClose} maxWidth="max-w-3xl">
      {renderPreview()}
    </Modal>
  );
};

export default FilePreviewModal;
