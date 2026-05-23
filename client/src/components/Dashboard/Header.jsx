import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineMoon, HiOutlineSun, HiMenu } from "react-icons/hi";
import logo from "../../assets/logo.png";
import UserAvatar from "../ui/UserAvatar";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const [mode, setMode] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "pink";
    const savedMode = localStorage.getItem("mode") || "light";
    setMode(savedMode);
    document.body.setAttribute("data-theme", savedTheme);
    document.body.setAttribute("data-mode", savedMode);
  }, []);

  const toggleMode = () => {
    const next = mode === "light" ? "dark" : "light";
    document.body.setAttribute("data-mode", next);
    localStorage.setItem("mode", next);
    setMode(next);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-[var(--border-color)] backdrop-blur-xl md:left-64"
      style={{ backgroundColor: "color-mix(in srgb, var(--bg-color) 85%, transparent)" }}
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            className="md:hidden btn-ghost p-2 shrink-0"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <HiMenu className="text-xl" />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2.5 min-w-0">
            <img src={logo} alt="" className="h-8 w-8 rounded-lg shrink-0" />
            <span className="font-bold text-lg text-[var(--text-color)] truncate">PasteBox</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={toggleMode}
            className="btn-ghost p-2.5 rounded-xl"
            aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {mode === "dark" ? <HiOutlineSun className="text-lg" /> : <HiOutlineMoon className="text-lg" />}
          </button>
          <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-[var(--border-color)]">
            <UserAvatar user={user} size="sm" />
            <div className="hidden md:block min-w-0 max-w-[140px] lg:max-w-[200px]">
              <p className="text-sm font-semibold text-[var(--text-color)] truncate">
                {user?.fullname || "User"}
              </p>
              <p className="text-xs text-[var(--secondary-text)] truncate">
                @{user?.username || "user"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
