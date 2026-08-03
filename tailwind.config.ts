import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14161A",
        ink2: "#1B1E24",
        card: "#1F232A",
        chalk: "#EAE7DF",
        chalkDim: "#B7B4AC",
        muted: "#8B8D93",
        gold: "#C9A227",
        goldSoft: "#E4C866",
        sage: "#4F7268",
        sageSoft: "#7CA093",
      },
      fontFamily: {
        serif: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
