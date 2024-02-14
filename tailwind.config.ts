import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  // need coreplugins so that mui overrides tailwind
  corePlugins: {
    preflight: false,
  },
} satisfies Config;
