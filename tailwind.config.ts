import type { Config } from "tailwindcss";
const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite-react/**/*.js",
    "./pages/**/*.{ts,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      keyframes: {
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
      animation: {
        bounce: 'bounce 1s infinite',
      },
      data: {
        active: 'ui~="active"',
        inactive: 'ui~="inactive"',
        // text: 'variant~="text"',
        // outlined: 'variant~="outlined"',
        // contained: 'variant~="contained"',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["DBHeavent-Light", ...defaultTheme.fontFamily.sans],
        button: ["DBHeavent-Light", ...defaultTheme.fontFamily.serif],
      },
      colors: {
        primary: {
          DEFAULT: "#1DA7B4",
          pink: "#E84C93"
        },
        secondary: {
          DEFAULT: "#DCF4F7"
        },
        danger: "#e53e3e",
        success: "#38a169",
        info: "#63b3ed",
        warning: "#ed8936",
        dark: "#2d3748",
        gray: "#616161",
        lightgray: "#C6C6C6",
        light: "#f7fafc",
        white: "#ffffff",
        black: "#212121",
        transparent: "transparent",
      },
      fontSize: {
        "2xs": "0.65rem",
        xs: "0.75rem",
        sm: "0.85rem",
        base: "1rem",
        lg: "1.25rem",
        xl: "1.75rem",
        "2xl": "2rem",
      },
    },
  },
  variants: {},
  plugins: [
    require("flowbite/plugin"),
    plugin(function ({ addBase, theme }: { addBase: any; theme: any }) {
      addBase({
        h1: { fontSize: theme("fontSize.2xl") },
        h2: { fontSize: theme("fontSize.xl") },
        h3: { fontSize: theme("fontSize.lg") },
        h4: { fontSize: theme("fontSize.base") },
        h5: { fontSize: theme("fontSize.sm") },
        h6: { fontSize: theme("fontSize.xs") },
        p: { fontSize: theme("fontSize.base") },
        a: { color: theme("colors.black") },
        "a:hover": { color: theme("colors.primary") },
      });
    }),
  ],
};
export default config;
