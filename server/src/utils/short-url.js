/**
 * Normalize any stored shortUrl to a relative path: /f/abc or /g/xyz
 */
export function normalizeShortPath(shortUrl) {
  if (!shortUrl) return null;

  const trimmed = String(shortUrl).trim();

  const match = trimmed.match(/\/([fg])\/([^/?#]+)/i);
  if (match) {
    return `/${match[1].toLowerCase()}/${match[2]}`;
  }

  if (trimmed.startsWith("/f/") || trimmed.startsWith("/g/")) {
    return trimmed;
  }

  return null;
}

export function extractShortCode(shortUrl) {
  const path = normalizeShortPath(shortUrl);
  if (!path) return null;
  const parts = path.split("/");
  return parts[2] || null;
}

export function buildShortPath(type, shortCode) {
  const prefix = type === "guest" ? "g" : "f";
  return `/${prefix}/${shortCode}`;
}

/**
 * Find File or GuestFile by short code (supports legacy BASE_URL-stored URLs)
 */
export async function findFileByShortCode(shortCode, { guest = false } = {}) {
  const { File } = await import("../models/file.models.js");
  const { GuestFile } = await import("../models/guestFile.models.js");
  const Model = guest ? GuestFile : File;
  const prefix = guest ? "/g/" : "/f/";

  const relative = `${prefix}${shortCode}`;
  let file = await Model.findOne({ shortUrl: relative });
  if (file) return file;

  if (process.env.BASE_URL) {
    const legacy = `${process.env.BASE_URL}${relative}`;
    file = await Model.findOne({ shortUrl: legacy });
    if (file) return file;
  }

  file = await Model.findOne({
    shortUrl: { $regex: `${prefix}${shortCode}$`, $options: "i" },
  });

  return file;
}
