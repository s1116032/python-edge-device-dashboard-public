/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 保留擴展空間
    },
  },
  plugins: [],
  // v3 需要這個核心設定
  corePlugins: {
    preflight: true,
  }
}