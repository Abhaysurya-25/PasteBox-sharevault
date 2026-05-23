import React, { useRef, useState } from "react";
import "./GuestFileUpload.css";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axiosInstance";

const GuestFileUpload = ({ guestFiles, updateFiles }) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);

  const [enablePassword, setEnablePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [enableExpiry, setEnableExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).filter(
      (file) => file.size <= 10 * 1024 * 1024
    );
    setPendingFiles((prev) => [...prev, ...newFiles]);
    toast.success("File(s) added!");
  };

  const handleFileInputChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("dragover");
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("dragover");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("dragover");
  };

  const removeFile = (index) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
    toast.info("File removed");
  };

  const totalSize = pendingFiles.reduce((acc, file) => acc + file.size, 0);
  const uploadedCount = Array.isArray(guestFiles) ? guestFiles.length : 0;

  const handleUpload = async () => {
    if (pendingFiles.length === 0) {
      toast.error("Please add at least one file to upload.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    pendingFiles.forEach((file) => formData.append("files", file));
    formData.append("hasExpiry", enableExpiry);

    if (enableExpiry && expiryDate) {
      const hours = Math.ceil(
        (new Date(expiryDate) - new Date()) / (1000 * 60 * 60)
      );
      formData.append("expiresAt", hours);
    }

    formData.append("isPassword", enablePassword);
    if (enablePassword && password) {
      formData.append("password", password);
    }

    try {
      const response = await axiosInstance.post(
        "/files/upload-guest",
        formData
      );

      const uploaded = response.data?.files;
      if (!uploaded?.length) {
        throw new Error("Upload response missing file data");
      }

      const normalized = uploaded.map((f) => ({
        ...f,
        _id: f._id || f.id,
        id: f.id || f._id,
      }));

      const fromStorage = JSON.parse(localStorage.getItem("guestFiles") || "[]");
      const existing = Array.isArray(guestFiles) ? guestFiles : fromStorage;
      updateFiles([...existing, ...normalized]);

      toast.success("Files uploaded successfully!");
      setPendingFiles([]);
      setEnablePassword(false);
      setPassword("");
      setEnableExpiry(false);
      setExpiryDate("");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Upload failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container upload-shell relative animate-fade-in">
      {loading && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10 rounded-lg">
          <div className="flex flex-col items-center gap-3 bg-white dark:bg-gray-800 px-8 py-6 rounded-lg shadow-lg">
            <div className="w-10 h-10 border-4 border-[var(--primary-text)] border-t-transparent rounded-full animate-spin" />
            <p className="font-medium">Uploading files...</p>
          </div>
        </div>
      )}

      <div className="header bg-[var(--bg-color)] text-[var(--text-color)] text-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--primary-text)] mb-4">
          File Upload
        </h1>
        <p className="font-bold text-[var(--primary-text)] mb-4">
          Drag & drop files or click to browse (no account required)
        </p>
      </div>

      <div
        className="dropbox"
        onClick={handleBrowseClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="dropbox-icon">📁</div>
        <div className="dropbox-text">Drop files here</div>
        <div className="dropbox-subtext">
          Supported formats: JPG, PNG, PDF, MP4, MOV, AVI, MKV (Max 10MB)
        </div>
        <button
          type="button"
          className="browse-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleBrowseClick();
          }}
        >
          Browse Files
        </button>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept=".jpg,.jpeg,.webp,.png,.mp4,.avi,.mov,.mkv,.mk3d,.mks,.mka,.pdf"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      <div className="extra-options bg-[var(--bg-color)] text-[var(--text-color)] mt-6">
        <div className="switch-container">
          <label className="switch-label">
            <span className="label-text">Set Password</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={enablePassword}
                onChange={(e) => setEnablePassword(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </label>
          {enablePassword && (
            <input
              type="password"
              className="password-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
        </div>

        <div className="switch-container">
          <label className="switch-label">
            <span className="label-text">Set Expiry Date</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={enableExpiry}
                onChange={(e) => setEnableExpiry(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </label>
          {enableExpiry && (
            <input
              type="datetime-local"
              className="expiry-input"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          )}
        </div>
      </div>

      {pendingFiles.length > 0 && (
        <div className="upload-stats">
          <div className="stats-header">
            <div className="stats-title">Ready to upload</div>
          </div>
          <div className="stats-info">
            <div className="stat-item">
              <div className="stat-value">{pendingFiles.length}</div>
              <div className="stat-label">Files</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {(totalSize / 1024).toFixed(2)} KB
              </div>
              <div className="stat-label">Total Size</div>
            </div>
          </div>
        </div>
      )}

      {pendingFiles.length === 0 && uploadedCount === 0 ? (
        <div className="empty-state">No files uploaded yet</div>
      ) : pendingFiles.length > 0 ? (
        <div className="file-previews">
          {pendingFiles.map((file, index) => (
            <div className="file-preview" key={`pending-${file.name}-${index}`}>
              <div className="preview-img-container">
                {file.type?.startsWith("image") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="preview-img"
                  />
                ) : file.type?.startsWith("video") ? (
                  <video
                    src={URL.createObjectURL(file)}
                    className="preview-video"
                    controls
                    muted
                    width="100"
                    height="80"
                  />
                ) : (
                  <div className="file-icon">📄</div>
                )}
              </div>
              <div className="file-info">
                <div className="file-name" title={file.name}>
                  {file.name}
                </div>
                <div className="file-size">
                  {file.size > 1024 * 1024
                    ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                    : `${(file.size / 1024).toFixed(2)} KB`}
                </div>
                <div className="file-actions">
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeFile(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-4 text-center">
          {uploadedCount} file{uploadedCount !== 1 ? "s" : ""} uploaded — see list
          below.
        </p>
      )}

      <div className="upload-action">
        <button
          type="button"
          className="upload-btn"
          onClick={handleUpload}
          disabled={loading || pendingFiles.length === 0}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};

export default GuestFileUpload;
