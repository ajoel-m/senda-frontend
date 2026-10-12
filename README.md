# SENDA — Plataforma Cívica de Gestión del Riesgo (Frontend)

Aplicación web interactiva desarrollada con **React 18**, **TypeScript**, **Vite** y **Tailwind CSS** para la evaluación cívica del riesgo estructural y rutas de evacuación ante sismos y aluviones en el Perú (Huaraz y Lima Metropolitana).

---

## Características Principales

- **Evaluación Estructural Cívica**: Cuestionario guiado de 6 factores basado en el RNE (E.030, E.070, E.080) y EVAR CENEPRED.
- **Cartografía Interactiva Leaflet**: Visualización de zonas seguras y fajas aluviales oficiales del INAIGEM y CENEPRED (SIGRID).
- **Ruta de Escape Inmediata**: Cálculo de evacuación peatonal en 0 clics hacia el refugio más cercano.
- **Modo Oscuro Integrado**: Paleta de alto contraste "Noche Andina" con persistencia en `localStorage`.
- **Accesibilidad y Tamaño de Letra**: Escalado dinámico de tipografía (Compacta, Normal, Grande, Muy grande) con previsualización en tiempo real.
- **Alertin**: Mascota guía empática que acompaña al ciudadano con consejos no alarmistas.

---

## Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [pnpm](https://pnpm.io/) (gestor de paquetes oficial del proyecto)

---

## Instalación y Ejecución

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   cd TU_REPOSITORIO
   ```

2. Instalar dependencias con `pnpm`:
   ```bash
   pnpm install
   ```

3. (Opcional) Configurar variables de entorno:
   Copiar `.env.example` a `.env` si se desea conectar a una instancia de Supabase:
   ```bash
   cp .env.example .env
   ```
   > **Nota:** La aplicación cuenta con modo de desarrollo autónomo con datos locales, por lo que puede ejecutarse y explorarse completamente sin configurar Supabase.

4. Iniciar el servidor de desarrollo:
   ```bash
   pnpm dev
   ```

5. Compilar para producción:
   ```bash
   pnpm build
   ```

---

## Estructura del Proyecto

```
frontend-version/
├── public/              # Assets estáticos y mascotas SVG (Alertin)
├── src/
│   ├── components/      # Componentes UI (Layout, Mapas, Formularios, Modales)
│   ├── context/         # Contextos globales (ThemeContext, AuthContext, EvaluationContext)
│   ├── lib/             # Motor algorítmico de riesgo (riskEngine.ts)
│   ├── pages/           # Vistas principales enrutadas
│   ├── services/        # Capas GIS, evacuación y servicios de datos
│   └── index.css        # Sistema de tokens SENDA y variables CSS
├── index.html           # Documento raíz con script anti-FOUC
├── tailwind.config.js   # Paleta oficial SENDA y darkMode por clases
└── vite.config.ts       # Configuración de bundler Vite
```

---

## Licencia

Iniciativa cívica y educativa para la resiliencia comunitaria en el Perú.
