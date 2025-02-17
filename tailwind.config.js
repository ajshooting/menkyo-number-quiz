/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue", // もし app.vue を使っていない場合は、entry point となるファイルを指定
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

