import { getUserInitial } from "../../utils/userDisplay";

export default function UserAvatar({ user, size = "md", className = "" }) {
  const sizes = {
    sm: "h-9 w-9 text-sm",
    md: "h-12 w-12 text-base",
    lg: "h-20 w-20 text-2xl",
    xl: "h-28 w-28 text-3xl",
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white shrink-0 border-2 border-white/30 shadow-md ${sizes[size]} ${className}`}
      style={{ background: "var(--primary-gradient)" }}
      aria-hidden
    >
      {getUserInitial(user)}
    </div>
  );
}
