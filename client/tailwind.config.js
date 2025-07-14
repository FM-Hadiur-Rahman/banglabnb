/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: ["bg-[#f43f5e]", "bg-[#9333ea]", "hamburger"],
  darkMode: "class", // ✅ Add this line here

  theme: {
    extend: {
      keyframes: {
        "slide-in": {
          "0%": { opacity: 0, transform: "translateY(100%)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-in": "slide-in 0.6s ease-out",
      },
    },
  },
  plugins: [],
};
