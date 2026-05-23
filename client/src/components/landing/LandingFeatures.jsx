const features = [
  {
    icon: "🔐",
    title: "Password protection",
    description: "Lock sensitive files behind a password before sharing.",
  },
  {
    icon: "⏱️",
    title: "Auto expiry",
    description: "Set when links expire so files don't live forever.",
  },
  {
    icon: "📊",
    title: "Download tracking",
    description: "See how many times your shared files were downloaded.",
  },
  {
    icon: "☁️",
    title: "AWS S3 storage",
    description: "Enterprise-grade cloud storage for reliability and speed.",
  },
  {
    icon: "📱",
    title: "QR & social share",
    description: "Share via WhatsApp, Facebook, email, or scannable QR codes.",
  },
  {
    icon: "👤",
    title: "Guest or account",
    description: "Upload without signing up, or save everything in your dashboard.",
  },
];

export default function LandingFeatures() {
  return (
    <section className="py-20 sm:py-28 border-t border-[var(--border-color)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="section-title">Everything you need to share</h2>
          <p className="section-subtitle mx-auto mt-3">
            Production-ready features wrapped in a clean, modern experience.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <article
              key={f.title}
              className="glass-card p-6 hover:shadow-glow transition-all duration-300 group"
            >
              <span className="text-3xl group-hover:scale-110 inline-block transition-transform duration-300">
                {f.icon}
              </span>
              <h3 className="mt-4 font-semibold text-lg text-[var(--text-color)]">{f.title}</h3>
              <p className="mt-2 text-sm text-[var(--secondary-text)] leading-relaxed">{f.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
