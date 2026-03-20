import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "#f97316",    // orange-500 — warm, appetising
                secondary: "#ca8a04",  // yellow-600 — honey accent
                accent: "#fff7ed",     // orange-50  — warm white
                dark: "#0f172a",       // slate-900  — deep text
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                serif: ["var(--font-playfair)", "serif"],
            },
            keyframes: {
                "pulse-slow": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.7" },
                },
            },
            animation: {
                "pulse-slow": "pulse-slow 3s ease-in-out infinite",
            },
        },
    },
    plugins: [],
} satisfies Config;
