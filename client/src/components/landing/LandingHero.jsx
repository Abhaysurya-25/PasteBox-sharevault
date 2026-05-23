import { Link } from "react-router-dom";
import { HiOutlineCloudUpload, HiOutlineShieldCheck, HiOutlineLink } from "react-icons/hi";

export default function LandingHero({ onScrollUpload }) {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24">
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-60 pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-color)]/80 px-4 py-1.5 text-xs font-medium text-[var(--secondary-text)] backdrop-blur-sm animate-fade-in">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
          Secure cloud file sharing · No signup required
        </span>
        <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-color)] animate-slide-up">
          Send large files.
          <span className="block bg-[var(--primary-gradient)] bg-clip-text text-transparent">
            Instantly & securely.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--secondary-text)] animate-fade-in">
          PasteBox is your modern file-sharing workspace — upload to AWS S3, protect with passwords, set expiry, and share via link, QR, or email.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button type="button" onClick={onScrollUpload} className="btn-primary text-base px-8 py-3">
            Upload files now
          </button>
          <Link to="/signup" className="btn-secondary text-base px-8 py-3">
            Create free account
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
          {[
            { icon: HiOutlineCloudUpload, title: "Fast uploads", desc: "Drag & drop up to 10MB per file" },
            { icon: HiOutlineShieldCheck, title: "Protected links", desc: "Password & expiry built in" },
            { icon: HiOutlineLink, title: "Easy sharing", desc: "QR, WhatsApp, email & more" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card p-5 text-center sm:text-left hover:shadow-glow transition-shadow duration-300">
              <Icon className="h-8 w-8 text-[var(--primary-text)] mx-auto sm:mx-0 mb-3" />
              <h3 className="font-semibold text-[var(--text-color)]">{title}</h3>
              <p className="text-sm text-[var(--secondary-text)] mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
