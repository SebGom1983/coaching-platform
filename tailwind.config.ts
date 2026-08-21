import type { Config } from "tailwindcss";

function themeColor(name: string) {
  return `rgb(var(--color-${name}) / <alpha-value>)`;
}

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: themeColor("ink"),
        ink2: themeColor("ink2"),
        card: themeColor("card"),
        chalk: themeColor("chalk"),
        chalkDim: themeColor("chalkDim"),
        muted: themeColor("muted"),
        gold: themeColor("gold"),
        goldSoft: themeColor("goldSoft"),
        sage: themeColor("sage"),
        sageSoft: themeColor("sageSoft"),
        line: themeColor("line"),
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
