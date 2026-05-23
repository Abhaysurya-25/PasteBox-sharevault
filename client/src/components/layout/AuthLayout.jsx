import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function AuthLayout({ children, title, subtitle, alternate }) {
  return (
    <div className="page-shell min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-hero-gradient bg-grid-pattern bg-grid opacity-40" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="PasteBox" className="h-10 w-10 rounded-xl" />
            <span className="text-xl font-bold">PasteBox</span>
          </Link>
          <div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight">
              Share files securely.
              <br />
              <span className="text-indigo-300">Without the friction.</span>
            </h1>
            <p className="mt-4 text-slate-400 text-lg max-w-md">
              Upload, protect with passwords, set expiry, and share via link, QR, or email — built for modern teams.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-slate-300">
              {["AWS S3 cloud storage", "Password & expiry controls", "QR & email sharing"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} PasteBox</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="lg:hidden mb-8 flex items-center gap-3">
          <img src={logo} alt="PasteBox" className="h-9 w-9 rounded-lg" />
          <span className="text-lg font-bold text-[var(--text-color)]">PasteBox</span>
        </div>
        <div className="mx-auto w-full max-w-md animate-slide-up">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-color)]">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-[var(--secondary-text)]">{subtitle}</p>
          )}
          <div className="mt-8 glass-card p-6 sm:p-8">{children}</div>
          {alternate && <div className="mt-6 text-center text-sm text-[var(--secondary-text)]">{alternate}</div>}
        </div>
      </div>
    </div>
  );
}
