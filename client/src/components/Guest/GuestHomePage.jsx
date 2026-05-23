import { useEffect, useState, useCallback } from "react";
import Header from "../HeaderComp";
import GuestFilePreview from "./GuestFilePreview";
import GuestFileUpload from "./GuestFileUpload";
import Footer from "../Footer";
import LandingHero from "../landing/LandingHero";
import LandingFeatures from "../landing/LandingFeatures";
import LandingStats from "../landing/LandingStats";

const UPLOAD_SECTION_ID = "guest-upload-section";
const HEADER_OFFSET = 80;

const GuestHomePage = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem("guestFiles") || "[]");
    setFiles(storedFiles);
  }, []);

  const scrollToUpload = useCallback(() => {
    const el = document.getElementById(UPLOAD_SECTION_ID);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (window.location.hash === `#${UPLOAD_SECTION_ID}`) {
      const t = setTimeout(scrollToUpload, 100);
      return () => clearTimeout(t);
    }
  }, [scrollToUpload]);

  const updateFiles = (newFiles) => {
    setFiles(newFiles);
    localStorage.setItem("guestFiles", JSON.stringify(newFiles));
  };

  return (
    <div className="page-shell flex flex-col">
      <Header onNavigateUpload={scrollToUpload} />
      <LandingHero onScrollUpload={scrollToUpload} />
      <LandingStats />

      <section
        id={UPLOAD_SECTION_ID}
        className="py-16 sm:py-20 scroll-mt-24"
        style={{ scrollMarginTop: `${HEADER_OFFSET}px` }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="section-title">Upload without an account</h2>
            <p className="section-subtitle mx-auto mt-3">
              Drop your files, set optional password & expiry, then share instantly.
            </p>
          </div>
          <GuestFileUpload guestFiles={files} updateFiles={updateFiles} />
          <div className="mt-12">
            <GuestFilePreview guestFiles={files} updateFiles={updateFiles} />
          </div>
        </div>
      </section>

      <LandingFeatures />

      <section className="py-16 border-t border-[var(--border-color)]">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold text-[var(--text-color)]">Want to save your files?</h2>
          <p className="mt-2 text-[var(--secondary-text)]">
            Create a free account for a full dashboard, analytics, and permanent file management.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a href="/signup" className="btn-primary">Get started free</a>
            <a href="/login" className="btn-secondary">Sign in</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GuestHomePage;
