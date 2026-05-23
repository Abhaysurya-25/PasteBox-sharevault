/** First letter for avatar — prefers username */
export function getUserInitial(user) {
  const source =
    user?.username?.trim() ||
    user?.fullname?.trim() ||
    user?.email?.trim() ||
    "U";
  return source.charAt(0).toUpperCase();
}
