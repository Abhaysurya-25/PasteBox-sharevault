import { FaWhatsapp, FaEnvelope, FaDownload, FaLink } from "react-icons/fa";
import { toast } from "react-toastify";
import { getShareLinks } from "../../utils/shareUrl";

const ShareModal = ({ file, onClose }) => {
  if (!file) return null;

  const links = getShareLinks(file.shortUrl);

  const downloadQRCode = async () => {
    try {
      const response = await fetch(links.qr);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "qr-code.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error("Failed to download QR code. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[var(--bg-color)] p-6 rounded shadow-lg w-full max-w-md md:max-w-2xl">
        <h3 className="text-lg font-bold mb-4 text-center text-[var(--text-color)]">
          Share &quot;{file.name}&quot;
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[var(--text-color)]">
          <a
            href={links.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 p-4 border rounded hover:shadow transition"
          >
            <FaWhatsapp className="text-green-500 text-2xl" />
            <span className="font-semibold">WhatsApp</span>
          </a>

          <a
            href={links.email}
            className="flex items-center gap-3 p-4 border rounded hover:shadow transition"
          >
            <FaEnvelope className="text-red-500 text-2xl" />
            <span className="font-semibold">Email</span>
          </a>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            QR Code:
          </p>
          <img
            src={links.qr}
            alt="QR Code"
            className="mx-auto border rounded w-32 h-32"
          />
          <div className="flex flex-col items-center mt-4 gap-2">
            <button
              onClick={downloadQRCode}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-500 rounded hover:bg-blue-200 transition"
            >
              <FaDownload className="text-blue-500 text-xl" />
              <span className="font-semibold">Download QR Code</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(links.copy);
                toast.success("Link copied to clipboard!");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-500 rounded hover:bg-blue-200 transition"
            >
              <FaLink className="text-blue-500 text-xl" />
              <span className="font-semibold">Copy Link</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
