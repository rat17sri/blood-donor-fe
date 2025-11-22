/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {}
  },
  plugins: [require("daisyui")],

  daisyui: {
    themes: [
      {
        bloodtheme: {
          "primary": "#C1121F",     // Deep medical red
          "secondary": "#FF4D6D",   // Accent soft red
          "accent": "#FFCCD5",      // Light red-pink tone
          "neutral": "#1E1E1E",
          "base-100": "#FFFFFF",    // Pure white elements
          "base-200": "#F8F8F8",    // Off-white background
          "info": "#1D4ED8",
          "success": "#0D9488",
          "warning": "#F59E0B",
          "error": "#B91C1C",
        },
      },
    ],
  },
};
