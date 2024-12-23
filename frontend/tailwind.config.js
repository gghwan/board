/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", 
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        '8xl': '90rem',
      },
      borderRadius: {
        'button': '0.375rem',
      },
      colors: {
        'custom': '#000000',
      },
    },
  },
  plugins: [
    import('@tailwindcss/forms'),
  ],
}
