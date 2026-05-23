import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import logo from "../assets/logo.png";

const Header = ({ onNavigateUpload }) => {
  const [menuOpen, setMenuOpen] = useState(false);
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

  const goToUpload = () => {
    if (onNavigateUpload) onNavigateUpload();
    setMenuOpen(false);
  };

  const UploadControl = ({ className }) =>
    onNavigateUpload ? (
      <button type="button" className={className} onClick={goToUpload}>
        Upload
      </button>
    ) : (
      <Link to="/#guest-upload-section" className={className} onClick={() => setMenuOpen(false)}>
        Upload
      </Link>
    );

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border-color)] backdrop-blur-xl"
        style={{ backgroundColor: "color-mix(in srgb, var(--bg-color) 85%, transparent)" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src={logo} alt="PasteBox" className="h-9 w-9 rounded-lg shadow-soft" />
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-[var(--text-color)]">PasteBox</span>
              <span className="block text-[10px] text-[var(--secondary-text)] -mt-0.5">File sharing</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <UploadControl className="btn-ghost" />
            <Link to="/login" className="btn-ghost">Sign in</Link>
            <Link to="/signup" className="btn-primary ml-2 text-sm py-2">Get started</Link>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <button type="button" onClick={toggleMode} className="btn-ghost p-2.5 rounded-xl" aria-label="Toggle dark mode">
              {mode === "dark" ? <HiOutlineSun className="text-lg" /> : <HiOutlineMoon className="text-lg" />}
            </button>
          </div>

          <button type="button" className="md:hidden btn-ghost p-2" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-72 glass-card rounded-l-2xl p-6 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-lg">Menu</span>
              <button type="button" onClick={() => setMenuOpen(false)} className="btn-ghost p-2">✕</button>
            </div>
            <nav className="flex flex-col gap-2">
              <UploadControl className="btn-ghost justify-start text-left w-full" />
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-ghost justify-start">Sign in</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-primary mt-2 text-center">Get started</Link>
            </nav>
            <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
              <button type="button" onClick={toggleMode} className="btn-secondary w-full">
                {mode === "dark" ? "Light mode" : "Dark mode"}
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Header;
