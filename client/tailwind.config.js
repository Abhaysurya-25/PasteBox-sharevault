/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["class", '[data-mode="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "var(--primary-text)",
          soft: "var(--primary-soft)",
          dark: "var(--primary-dark)",
        },
        surface: {
          DEFAULT: "var(--bg-color)",
          muted: "var(--surface-muted)",
        },
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(15, 23, 42, 0.08)",
        glow: "0 8px 32px -8px color-mix(in srgb, var(--primary-text) 35%, transparent)",
        card: "0 1px 3px rgba(15,23,42,.06), 0 8px 24px -6px rgba(15,23,42,.08)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.45s ease-out forwards",
        shimmer: "shimmer 1.5s infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.08) 1px, transparent 1px)",
        "hero-gradient": "var(--hero-gradient)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
    },
  },
  plugins: [],
};
