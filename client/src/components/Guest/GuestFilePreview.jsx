import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNowStrict, differenceInDays } from "date-fns";
import { toast } from "react-toastify";
import ShareModal from "../common/ShareModal";
import FilePreviewModal from "../common/FilePreviewModal";
import { Link } from "react-router-dom";
import { FaEye, FaShare, FaTrashAlt } from "react-icons/fa";

const GuestFilePreview = ({ guestFiles }) => {
  const dispatch = useDispatch();
  const [files, setFiles] = useState(guestFiles || []);
  const [previewFile, setPreviewFile] = useState(null);
  const [shareFile, setShareFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortFileName = (filename) => {
    // Sort the file name to ensure consistent display
    return filename.length > 20 ? `${filename.slice(0, 20)}...` : filename;
  };

  const deleteFile = (fileId) => {
    if (!fileId) {
      toast.error("File ID is invalid.");
      return;
    }

    const updatedFiles = files.filter(
      (file) => (file._id || file.id) !== fileId
    );

    setFiles(updatedFiles);
    localStorage.setItem("guestFiles", JSON.stringify(updatedFiles));

    // Re-sync from localStorage (if that's your source of truth)
    const refreshedFiles = JSON.parse(localStorage.getItem("guestFiles")) || [];
    setFiles(refreshedFiles);

    toast.success("File deleted successfully!");
  };

  useEffect(() => {
    setFiles(guestFiles);
  }, [guestFiles]);



  const filteredFiles = files?.filter((file) => {
    const nameMatch = file.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const typeMatch = filterType ? file.type === filterType : true;

    const statusMatch = filterStatus
      ? filterStatus === "expired"
        ? differenceInDays(new Date(file.expiresAt), new Date()) <= 0
        : differenceInDays(new Date(file.expiresAt), new Date()) > 0
      : true;

    return nameMatch && typeMatch && statusMatch;
  });

  const totalPages = Math.ceil((filteredFiles?.length || 0) / itemsPerPage);
  const paginatedFiles = filteredFiles?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[var(--primary-text)] mb-4">📁 Your Uploaded Files</h2>
        <p className="text-sm text-[var(--primary-text)]">
          Showing {filteredFiles.length} file{filteredFiles.length !== 1 && "s"}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 w-full lg:items-center mb-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-text)]"
            placeholder="Search by file name"
            aria-label="Search"
          />
        </div>

        <select
          className="px-3 py-2 border rounded-lg text-gray-900"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          {[...new Set(files?.map((f) => f.type))].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          className="px-3 py-2 border rounded-lg text-gray-900"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>

        {(filterType || filterStatus || searchTerm) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterType("");
              setFilterStatus("");
            }}
            className="px-3 py-2 bg-red-100 text-red-500 rounded hover:bg-red-200"
          >
            Reset
          </button>
        )}
      </div>

      {!files || files.length === 0 ? (
        <p className="text-gray-500">No files uploaded yet.</p>
      ) : (
        <div className="-my-2 overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden border border-[var(--border-color)] rounded-md shadow-md">
              <table className="min-w-full divide-y divide-[var(--border-color)] text-[var(--text-color)]">
                <thead className="bg-[var(--primary-text)] text-[var(--text-on-primary)] hidden md:table-header-group">
                  <tr>
                    {[
                      "File Name",
                      "Size",
                      "Type",
                      "Download",
                      "Status",
                      "Actions",
                      "Expiry At",
                      "Uploaded At",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="bg-[var(--bg-color)] divide-y divide-[var(--border-color)]">
                  {paginatedFiles?.map((file) => {
                    const shareLinks = handleShare(file.shortUrl);
                    const formattedSize =
                      file.size > 1024 * 1024
                        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                        : file.size > 1024
                        ? `${(file.size / 1024).toFixed(2)} KB`
                        : `${file.size} Bytes`;

                    const isExpired =
                      differenceInDays(new Date(file.expiresAt), new Date()) <=
                      0;

                    return (
                      <>
                        {/* Desktop Row */}
                        <tr
                          key={file._id}
                          className="hover:bg-[var(--hover-bg-color)] hidden md:table-row"
                        >
                          <td className="px-6 py-4 text-sm">
                            {sortFileName(file.name)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">
                            {formattedSize}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">
                            {file.type}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">
                            {file.downloadedContent}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`font-medium ${
                                file.status === "active"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {file.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex gap-2 mt-2 text-sm space-x-3">
                            <button
                              onClick={() => setPreviewFile(file)}
                              className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 border border-blue-500 rounded hover:bg-blue-50 transition"
                            >
                              <FaEye /> Preview
                            </button>

                            {/* Share */}
                            <button
                              onClick={() => setShareFile(file)}
                              className="flex items-center gap-1 px-3 py-1 text-sm text-purple-600 border border-purple-500 rounded hover:bg-purple-50 transition"
                            >
                              <FaShare /> Share
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => deleteFile(file.id)}
                              className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 border border-red-500 rounded hover:bg-red-50 transition"
                            >
                              <FaTrashAlt /> Delete
                            </button>
                            <br />
                          </td>
                          <td className="px-6 py-4 text-sm text-red-500">
                            {isExpired
                              ? "Expired"
                              : `Expires in ${differenceInDays(
                                  new Date(file.expiresAt),
                                  new Date()
                                )} days`}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">
                            Uploaded{" "}
                            {formatDistanceToNowStrict(
                              new Date(file.createdAt),
                              {
                                addSuffix: true,
                              }
                            )}
                          </td>
                        </tr>

                        {/* Mobile Card */}
                        <tr
                          key={`mobile-${file._id}`}
                          className="block md:hidden border-b border-gray-200"
                        >
                          <td className="block px-4 py-4">
                            <div className="mb-2">
                              <strong className="text-gray-700 dark:text-gray-200">
                                📄 {sortFileName(file.name)}
                              </strong>
                              <div className="text-xs text-gray-400">
                                {file.type} | {formattedSize}
                              </div>
                            </div>
                            <div className="text-sm text-gray-500 mb-1">
                              <span className="font-medium">Status: </span>
                              <span
                                className={
                                  file.status === "active"
                                    ? "text-green-600"
                                    : "text-red-500"
                                }
                              >
                                {file.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 mb-1">
                              <span className="font-medium">Downloaded:</span>{" "}
                              {file.downloadedContent}
                            </div>
                            <div className="text-sm text-gray-500 mb-1">
                              <span className="font-medium">Expiry:</span>{" "}
                              {isExpired
                                ? "Expired"
                                : `Expires in ${differenceInDays(
                                    new Date(file.expiresAt),
                                    new Date()
                                  )} days`}
                            </div>
                            <div className="text-sm text-gray-500 mb-1">
                              <span className="font-medium">Uploaded:</span>{" "}
                              {formatDistanceToNowStrict(
                                new Date(file.createdAt),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </div>

                            <div className="flex flex-wrap gap-4 mt-3">
                             <button
                              onClick={() => setPreviewFile(file)}
                              className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 border border-blue-500 rounded hover:bg-blue-50 transition"
                            >
                              <FaEye /> Preview
                            </button>

                            {/* Share */}
                            <button
                              onClick={() => setShareFile(file)}
                              className="flex items-center gap-1 px-3 py-1 text-sm text-purple-600 border border-purple-500 rounded hover:bg-purple-50 transition"
                            >
                              <FaShare /> Share
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => deleteFile(file.id)}
                              className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 border border-red-500 rounded hover:bg-red-50 transition"
                            >
                              <FaTrashAlt /> Delete
                            </button>
                            </div>
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4 px-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded text-white bg-[var(--primary-text)] hover:opacity-90 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-950 dark:text-gray-900">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded text-white bg-[var(--primary-text)] hover:opacity-90 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-800 mt-6 text-center text-sm">
  Want to save your progress?{" "}
  <Link
    to="/login"
    className="text-blue-600 font-medium hover:underline hover:text-blue-800 transition-colors duration-200"
  >
    Log in
  </Link>{" "}
  or{" "}
  <Link
    to="/signup"
    className="text-blue-600 font-medium hover:underline hover:text-blue-800 transition-colors duration-200"
  >
    Create an account
  </Link>
</p>

        </div>
      )}

      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          isGuest
          onClose={() => setPreviewFile(null)}
        />
      )}

      {shareFile && (
        <ShareModal file={shareFile} onClose={() => setShareFile(null)} />
      )}
    </div>
  );
};

export default GuestFilePreview;
