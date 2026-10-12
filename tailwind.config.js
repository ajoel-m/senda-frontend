/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Paleta oficial SENDA (única, aprobada) ──────────────────────
        senda: {
          nevado: '#0D3B66',
          cielo: '#7EC8F7',
          atardecer: '#FFD166',
          ruta: '#FF8A3D',
          coral: '#FF5B7E',
          nieve: '#F7F9FC',
        },
        // Fondo global y superficies vinculadas a variables CSS para soporte total Light / Dark
        canvas: {
          glacial: 'rgb(var(--color-canvas-glacial-rgb) / <alpha-value>)', // Nieve / Noche Andina
          surface: 'rgb(var(--color-canvas-surface-rgb) / <alpha-value>)', // Tarjetas / modales
        },
        // Texto semántico dinámico
        ink: {
          primary: 'rgb(var(--color-ink-primary-rgb) / <alpha-value>)',   // Nevado / Blanco alto contraste
          muted: 'rgb(var(--color-ink-muted-rgb) / <alpha-value>)',       // Derivado para lectura secundaria
          inverted: 'rgb(var(--color-ink-inverted-rgb) / <alpha-value>)',
        },
        // Acción primaria / prevención (azul de marca). Escala completa
        sky: {
          50: 'rgb(var(--color-sky-50-rgb) / <alpha-value>)',
          100: 'rgb(var(--color-sky-100-rgb) / <alpha-value>)',
          200: '#B3DBF5',
          400: '#7EC8F7',  // Cielo
          500: '#4FA8E8',
          600: '#1E6FB5',  // CTA principal (contraste AA sobre blanco)
          700: 'rgb(var(--color-sky-700-rgb) / <alpha-value>)',  // Nevado / Enlace activo
          800: '#092A4A',
        },
        // Estado seguro — excepción intencional
        life: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          500: '#10B981',
          600: '#059669',
        },
        // Advertencia moderada / acento — Atardecer y Coral
        dawn: {
          amber: '#FFD166',       // Atardecer
          amberSurface: '#FFF6DF',
          rose: '#FF5B7E',        // Coral
          roseSurface: '#FFE9EE',
        },
        // Alerta crítica / botón de pánico
        emergency: {
          50: '#FFF0F3',
          100: '#FFE1E7',
          200: '#FFC2CE',
          400: '#FF8098',
          600: '#E63950',
          700: '#C2273D', // estado presionado
          surface: '#FFEEF1',
        },
        // Ruta de evacuación en el mapa
        evacuation: {
          cyan: '#FF8A3D', // Ruta
        },
        border: {
          subtle: 'rgb(var(--color-border-subtle-rgb) / <alpha-value>)',
          strong: 'rgb(var(--color-border-strong-rgb) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Fredoka', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Escala Mobile-First adaptable al factor de tamaño raíz (rem)
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.5', fontWeight: '600' }],
        '2xl': ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],
      },
    },
  },
  plugins: [],
}
