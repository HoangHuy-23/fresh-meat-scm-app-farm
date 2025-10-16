/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/app/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#28A745", // Màu xanh lá cây chủ đạo
          light: "#52C46E",   // Nhạt hơn, dùng cho hover hoặc background
          dark: "#1E7E34",    // Đậm hơn, dùng cho active state hoặc text
        },
      },
    },
  },
  plugins: [],
};
