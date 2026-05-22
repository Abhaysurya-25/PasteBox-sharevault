/**
 * Normalize stored shortUrl to a frontend route path (/f/xxx or /g/xxx)
 */
export function getSharePath(shortUrl) {
  if (!shortUrl) return "";
  const trimmed = String(shortUrl).trim();
  const match = trimmed.match(/\/([fg])\/([^/?#]+)/i);
  if (match) return `/${match[1].toLowerCase()}/${match[2]}`;
  if (trimmed.startsWith("/f/") || trimmed.startsWith("/g/")) return trimmed;
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export function buildShareUrl(shortUrl) {
  return `${window.location.origin}${getSharePath(shortUrl)}`;
}

export function getShareLinks(shortUrl) {
  const fullUrl = buildShareUrl(shortUrl);

  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent("Download file: " + fullUrl)}`,
    email: `mailto:?subject=Shared File&body=${encodeURIComponent("Here's your file: " + fullUrl)}`,
    copy: fullUrl,
    qr: `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(fullUrl)}&size=150x150`,
  };
}
