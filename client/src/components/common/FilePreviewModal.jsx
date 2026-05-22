import { useEffect, useState } from "react";
import { filesApiUrl } from "../../config/api";

const FilePreviewModal = ({ file, onClose, isGuest = false }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) return;

    const loadPreview = async () => {
      setLoading(true);
      setError("");
      try {
        const path = isGuest
          ? `/preview/guest/${file._id || file.id}`
          : `/preview/${file._id}`;
        const res = await fetch(filesApiUrl(path));
        if (!res.ok) throw new Error("Preview unavailable");
        const data = await res.json();
        setPreviewUrl(data.previewUrl);
      } catch {
        setError("Could not load preview. The file may be private or expired.");
      } finally {
        setLoading(false);
      }
    };

    loadPreview();
  }, [file, isGuest]);

  if (!file) return null;

  const renderPreview = () => {
    if (loading) {
      return <p className="text-gray-500 py-8 text-center">Loading preview...</p>;
    }
    if (error || !previewUrl) {
      return <p className="text-red-500 py-4 text-center">{error || "Preview unavailable"}</p>;
    }

    if (file.type?.startsWith("image/")) {
      return (
        <img src={previewUrl} alt={file.name} className="w-full h-auto rounded mb-4" />
      );
    }
    if (file.type?.startsWith("video/")) {
      return (
        <video controls className="w-full h-auto rounded mb-4">
          <source src={previewUrl} type={file.type} />
        </video>
      );
    }
    if (file.type?.startsWith("audio/")) {
      return (
        <audio controls className="w-full mb-4">
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
    return <p className="text-gray-500">Preview not supported for this file type.</p>;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{file.name}</h3>
        {renderPreview()}
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
