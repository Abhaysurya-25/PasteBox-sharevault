import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  FaWhatsapp,
  FaFacebook,
  FaEnvelope,
  FaDownload,
  FaLink,
  FaPaperPlane,
  FaCheck,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { getShareLinks } from "../../utils/shareUrl";
import { sendLinkEmail } from "../../redux/slice/file/fileThunk";
import Modal from "../ui/Modal";

const shareOptions = [
  { key: "whatsapp", label: "WhatsApp", icon: FaWhatsapp, color: "text-emerald-500", bg: "hover:bg-emerald-50 dark:hover:bg-emerald-500/10" },
  { key: "facebook", label: "Facebook", icon: FaFacebook, color: "text-blue-600", bg: "hover:bg-blue-50 dark:hover:bg-blue-500/10" },
  { key: "email", label: "Email app", icon: FaEnvelope, color: "text-rose-500", bg: "hover:bg-rose-50 dark:hover:bg-rose-500/10", isMailto: true },
];

const ShareModal = ({ file, onClose, isGuest = false }) => {
  const dispatch = useDispatch();
  const [recipientEmail, setRecipientEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!file) return null;

  const links = getShareLinks(file.shortUrl);
  const fileId = file._id || file.id;
  const displayName = file.name?.length > 40 ? `${file.name.slice(0, 37)}...` : file.name;

  const downloadQRCode = async () => {
    try {
      const response = await fetch(links.qr);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "pastebox-qr.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      toast.success("QR code downloaded");
    } catch {
      toast.error("Failed to download QR code");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(links.copy);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  const handleSendEmail = async () => {
    if (!recipientEmail.trim()) {
      toast.warn("Enter a recipient email");
      return;
    }
    if (!fileId) {
      toast.error("File ID missing — refresh and try again");
      return;
    }
    setSendingEmail(true);
    try {
      await dispatch(
        sendLinkEmail({ fileId, email: recipientEmail.trim(), isGuest })
      ).unwrap();
      toast.success("Share link sent!");
      setRecipientEmail("");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to send email");
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <Modal title={`Share "${displayName}"`} onClose={onClose} maxWidth="max-w-lg">
      <div className="grid grid-cols-3 gap-3">
        {shareOptions.map(({ key, label, icon: Icon, color, bg, isMailto }) => (
          <a
            key={key}
            href={links[key]}
            target={isMailto ? undefined : "_blank"}
            rel="noreferrer"
            className={`flex flex-col items-center gap-2 rounded-xl border border-[var(--border-color)] p-4 transition-all duration-200 ${bg} hover:shadow-soft hover:-translate-y-0.5`}
          >
            <Icon className={`text-2xl ${color}`} />
            <span className="text-xs font-semibold text-[var(--text-color)]">{label}</span>
          </a>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-[var(--border-color)] bg-[var(--surface-muted)]/40 p-4">
        <p className="text-sm font-medium text-[var(--text-color)] mb-3">Send link by email</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="recipient@example.com"
            className="input-field flex-1"
          />
          <button
            type="button"
            onClick={handleSendEmail}
            disabled={sendingEmail}
            className="btn-primary shrink-0"
          >
            <FaPaperPlane />
            {sendingEmail ? "Sending..." : "Send"}
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center">
        <p className="text-sm font-medium text-[var(--text-color)] mb-3">QR Code</p>
        <div className="rounded-2xl border-2 border-[var(--border-color)] p-4 bg-white shadow-soft">
          <img src={links.qr} alt="QR Code" className="w-36 h-36" />
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={downloadQRCode} className="btn-secondary text-sm">
            <FaDownload /> Download QR
          </button>
          <button type="button" onClick={handleCopy} className="btn-primary text-sm">
            {copied ? <FaCheck /> : <FaLink />}
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      </div>

      <div className="mt-6 p-3 rounded-xl bg-[var(--surface-muted)]/50 border border-[var(--border-color)]">
        <p className="text-xs text-[var(--secondary-text)] break-all font-mono">{links.copy}</p>
      </div>
    </Modal>
  );
};

export default ShareModal;
