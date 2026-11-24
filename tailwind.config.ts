import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1360px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Public-site tokens: flip with the .dark class (see index.css)
        canvas: {
          DEFAULT: "hsl(var(--canvas) / <alpha-value>)",
          2: "hsl(var(--canvas-2) / <alpha-value>)",
        },
        fg: "hsl(var(--fg) / <alpha-value>)",
        brand: "hsl(var(--brand) / <alpha-value>)",
        // Brand — taken from ymrglobal.org and the City Takers flyer
        ink: "#0e0b09",
        ember: {
          DEFAULT: "#f68b1e",
          deep: "#e26700",
          text: "hsl(var(--ember-text))",
        },
        gold: {
          DEFAULT: "#fbaa1a",
          soft: "#f4d35e",
          pale: "#fff1c9",
        },
        cream: "#f6efe6",
        status: {
          good: "#0ca30c",
          warning: "#fab219",
          serious: "#ec835a",
          critical: "#d03b3b",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["Cinzel", '"Trajan Pro"', "Georgia", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        scan: { "0%": { top: "0%" }, "100%": { top: "100%" } },
        "fade-up": { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee 40s linear infinite",
        "spin-slow": "spin-slow 90s linear infinite",
        shimmer: "shimmer 6s linear infinite",
        float: "float 5s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(0.2,0.6,0.3,1) infinite",
        scan: "scan 1.6s ease-in-out infinite alternate",
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
