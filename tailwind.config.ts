import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F4F0FF",
          100: "#EAE2FE",
          500: "#6E38ED",
          600: "#5E2CED", // accent purple
          650: "#5223D8",
          700: "#4a17a3", // main brand purple
          800: "#3D128B",
          900: "#2B0C61",
        },
        accent: {
          400: "#FDBA74",
          500: "#FB923C",
          600: "#F97316", // orange CTA
          700: "#EA580C",
        },
        navy: {
          900: "#120C2E", // footer background
          800: "#1B1440",
        },
        surface: {
          lavender: "#fbf2fe", // pink-lavender section backgrounds matching Laravel
          white: "#FFFFFF",
        },
        success: "#44bb7f",
        warning: "#fbb039", // star ratings
        text: {
          heading: "#06092d",
          body: "#2f2f2f",
          muted: "#78787c",
        },
      },
      fontSize: {
        base: ["15px", "24px"],
      },
      borderRadius: {
        card: "0.375rem", // sharper card corners matching Laravel style
        pill: "9999px",
        btn: "3px", // sharp button corners
      },
      boxShadow: {
        card: "0 4px 15px rgba(74, 23, 163, 0.05)",
        cardHover: "0 8px 25px rgba(74, 23, 163, 0.1)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #5e2ced 0%, #4821c3 100%)",
        "gradient-promo":
          "linear-gradient(135deg, #4821c3 0%, #5e2ced 50%, #fe6b8d 100%)",
        "gradient-logo": "linear-gradient(135deg, #4a17a3 0%, #F97316 100%)",
      },
      fontFamily: {
        sans: ["var(--font-roboto)", "sans-serif"],
        heading: ["var(--font-roboto)", "sans-serif"],
        serif: ["var(--font-roboto)", "sans-serif"],
        mono: ["var(--font-roboto)", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
