/** @type {import('tailwindcss').Config} */
import konstaConfig from 'konsta/config';

// Envuelve tu configuración con konstaConfig
export default konstaConfig({
  content: ['./src/**/*.{mjs,js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  plugins: []
});
