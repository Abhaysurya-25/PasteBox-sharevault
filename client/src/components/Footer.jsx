import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-color)] mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="PasteBox" className="h-9 w-9 rounded-lg" />
              <span className="text-lg font-bold text-[var(--text-color)]">PasteBox</span>
            </Link>
            <p className="mt-3 text-sm text-[var(--secondary-text)] max-w-sm leading-relaxed">
              Modern file sharing powered by AWS S3. Upload, protect, and share — built for speed and simplicity.
            </p>
          </div>
          <div className="sm:col-span-2 lg:col-span-1 lg:justify-self-end">
            <h4 className="font-semibold text-[var(--text-color)] text-sm">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-[var(--secondary-text)]">
              <li>
                <Link to="/" className="hover:text-[var(--primary-text)] transition-colors">
                  Upload
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[var(--primary-text)] transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-[var(--primary-text)] transition-colors">
                  Sign up
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[var(--secondary-text)]">
          <p>© {new Date().getFullYear()} PasteBox. All rights reserved.</p>
          <p>
            Made with <span className="text-red-500" aria-label="love">♥</span> by Abhay Surya
          </p>
        </div>
      </div>
    </footer>
  );
}
