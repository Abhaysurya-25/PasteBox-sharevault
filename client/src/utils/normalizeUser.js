function toIdString(value) {
  if (value == null) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    if (value.$oid) return String(value.$oid);
    if (typeof value.toString === "function") {
      const str = value.toString();
      if (str && str !== "[object Object]") return str;
    }
  }
  return String(value);
}

export function normalizeUser(raw) {
  if (!raw || typeof raw !== "object") return null;

  const id = toIdString(raw.id ?? raw._id);
  if (!id || id === "[object Object]") return null;

  return {
    id,
    _id: id,
    fullname: raw.fullname || raw.name || "User",
    username: raw.username || "",
    email: raw.email || "",
    profilePic: raw.profilePic || "",
    lastLogin: raw.lastLogin,
    totalUploads: raw.totalUploads ?? 0,
    totalDownloads: raw.totalDownloads ?? 0,
    videoCount: raw.videoCount ?? 0,
    imageCount: raw.imageCount ?? 0,
    documentCount: raw.documentCount ?? 0,
  };
}

export function getUserId(user) {
  if (!user) return null;
  return user.id || user._id || null;
}
