import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        linen: "#F5EFE4",
        paper: "#FFFBF3",
        ink: "#171411",
        night: "#211B17",
        clay: "#C6633F",
        sage: "#607462",
        moss: "#2F5E54",
        mint: "#BFE7D2",
        amber: "#F0B35A",
        oat: "#E7D5BB",
        slateWarm: "#514A43"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(39, 35, 31, 0.08)",
        lift: "0 24px 80px rgba(23, 20, 17, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;
