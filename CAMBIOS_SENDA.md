# Unificación visual a Senda — registro de esta pasada

Base de trabajo: estructura de `mi-casa-segura.zip` (versión del compañero).
Se conservan los nombres de archivo y de tokens que ya usaba el código
(`canvas`, `ink`, `sky`, `life`, `dawn`, `emergency`, `evacuation`, `border`)
para no tener que tocar cada componente uno por uno; lo que cambió son los
valores hex detrás de esos nombres.

## 1. Paletas eliminadas
- `andina` (definida en `tailwind.config.js`) — **no se usaba en ningún
  componente**, solo aparecía la palabra "andina/andinas" como adjetivo en
  textos sueltos. Eliminada sin reemplazo.
- `cartilla` — 0 usos en todo el código. Eliminada.
- `--color-andina-*` de `src/assets/theme.css` — archivo completo eliminado,
  no lo importaba nada (`main.tsx` solo importa `index.css`).

## 2. Paleta única (Senda)
Nuevo namespace `senda.*` en `tailwind.config.js` con los 6 swatches tal
cual el brand board (Nevado `#0D3B66`, Cielo `#7EC8F7`, Atardecer `#FFD166`,
Ruta `#FF8A3D`, Coral `#FF5B7E`, Nieve `#F7F9FC`).

Mapeo de los tokens semánticos existentes → Senda:
| Token | Antes | Ahora | Origen Senda |
|---|---|---|---|
| `canvas.glacial` | `#F0F7FA` | `#F7F9FC` | Nieve |
| `ink.primary` | `#0B192C` | `#0D3B66` | Nevado |
| `sky.400` | `#38BDF8` | `#7EC8F7` | Cielo (exacto) |
| `sky.600` (CTA) | `#0284C7` | `#1E6FB5` | entre Cielo y Nevado, AA sobre blanco |
| `sky.700` | `#0369A1` | `#0D3B66` | Nevado |
| `dawn.amber` | `#F59E0B` | `#FFD166` | Atardecer (exacto) |
| `dawn.rose` | `#FB7185` | `#FF5B7E` | Coral (exacto) |
| `evacuation.cyan` (ruta en mapa) | `#06B6D4` | `#FF8A3D` | Ruta (exacto, y el nombre del swatch coincide con el uso) |
| `emergency.600/700` | `#DC2626`/`#B91C1C` | `#E63950`/`#C2273D` | Coral llevado a rojo de alarma |

**Excepción marcada a propósito:** `life.*` (verde, "seguro/GPS activo") se
mantiene en verde aunque no es un color de marca de Senda — el mockup del
mapa de riesgos usa semáforo rojo/ámbar/verde para Alto/Medio/Bajo, y Senda
no define un verde propio. Si el equipo quiere resolver esto con un verde
de marca, hay que definirlo — no lo inventé.

También completé escalas de color que el código ya usaba pero que no
estaban definidas en ninguna de las 4 paletas anteriores (`sky-100/200/500/800`,
`life-100/200`, `emergency-50/100/200/400`) — antes se renderizaban sin
color en varios componentes.

## 3. Hex hardcodeados fuera de Tailwind
Reemplazados en: `MascotGuide.tsx`, `Button.tsx`, `RiskReport.tsx`,
`CleanAssessmentResult.tsx`, `LeafletMap.tsx`, `LeadCaptureForm.tsx`,
`pdfGenerator.ts`, `HousingForm.tsx`, `HomePage.tsx`, `LandingPage.tsx`,
`PreventionCenterPage.tsx`, `TermsOfServicePage.tsx`.

## 4. Mascota → Alertin
- `MascotGuide.tsx` usaba un placeholder emoji 🦊 llamado "Wayra / Guardián
  Andino" (herencia de la identidad Cartilla Andina). Reemplazado por las
  imágenes reales de Alertin (`/public/mascots/alertin_*.svg`, copiados de
  tus archivos subidos) según el estado (explaining/warning/success/neutral).
- Referencias de texto a "Wayra"/"Guardián Andino" actualizadas a Alertin
  en `NextStepsPage.tsx`.
- La base **no tenía a Mapin ni Nevadin** (esos viven en tu versión
  anterior) — así que aquí no hubo que retirar nada, solo instalar Alertin.

## 5. Esquinas: de "anti-SaaS" (planas) a estilo Senda (suaves)
El CSS global y `MascotGuide.tsx` tenían `border-radius: 2px` explícito con
un comentario "REGLA ANTI-SAAS ... Estrictamente prohibido ... bordes
redondeados", que contradice el estilo Senda aprobado ("trazos suaves y
redondeados"). Corregido en `index.css` y `MascotGuide.tsx`. **Puede que
existan más lugares con esta regla de esquinas planas** — no barrí todo el
código buscándolos, se revisa en la siguiente pasada si hace falta.

## 6. Botón de pánico
`PanicButton.tsx` usaba `from-red-600 to-amber-600` (colores default de
Tailwind, no de marca). Ahora usa `bg-emergency-600` / `hover:bg-emergency-700`.
La duración de pulsación (500ms) ya estaba bien en `BottomNav.tsx` — coincide
con lo que confirmaste, no hubo que tocarla.

## Pendiente (no incluido en esta pasada)
- Portar desde tu versión anterior: historial de ubicación en el modo
  pánico, submenú Prepararme (5 accesos), Modo técnico.
- Lógica de escape en 2 etapas (`evacuationService`).
- Decisión de equipo sobre el `TrustFeedbackWidget` / micro-encuesta al
  final del recorrido de escape — **no la resolví, según lo acordado**.

---

# Paso 2 — Modo Pánico con historial/respaldo de ubicación

Se integró en `PanicEscapePage.tsx` (la página de escape del compañero, en
`/panico`) el mecanismo de resolución de ubicación de tu versión anterior
(`web-app_MIA_AMY/src/hooks/useResolvedLocation.ts`), que antes solo hacía
un intento de GPS y si fallaba se quedaba en un punto fijo de Huaraz.

## Archivos nuevos
- `src/lib/pendingLocation.ts` — `persistPendingLocation` / `readPendingLocation`,
  portados de tu `LandingPage.tsx` (misma clave de `sessionStorage`:
  `mcs_pending_location`), ahora tipados con el `Coordinates` de
  `EvaluationContext` de la base del compañero (ya traía `accuracy?`, no
  hizo falta cambiar el tipo).
- `src/hooks/useResolvedLocation.ts` — mismo hook de tu versión, adaptado a
  ese `Coordinates` y a la nueva ruta del util de persistencia.

## Archivos modificados
- `PanicEscapePage.tsx`: reemplacé el `useEffect` que solo probaba GPS una
  vez (con fallback a coordenadas fijas) por `useResolvedLocation()`. Ahora
  la cascada es GPS en vivo → última ubicación guardada en este navegador →
  punto de referencia en Huaraz. Agregué el indicador de texto ("Usando tu
  ubicación GPS...", "GPS no disponible: usando tu última ubicación
  guardada...", etc., igual que en tu versión) y una pantalla de "Buscando
  tu ubicación..." mientras se resuelve, antes de mostrar el mapa y la ruta.
  Quité el prop `userCoords` (ya no se usa ni se pasaba desde `App.tsx`).
- `AssessmentPage.tsx`: cuando el usuario ubica su vivienda por GPS o
  tocando el mapa (en `/evaluar`), ahora esa ubicación también se guarda
  con `persistPendingLocation`. Así, si luego entra en pánico sin señal GPS,
  el Modo Pánico puede reutilizar la última ubicación que sí se conoce, en
  vez de caer directo al punto de referencia genérico de Huaraz.

## Pendiente
- Submenú Prepararme (5 accesos).
- Lógica de escape en 2 etapas (lateral → refugio) — `PanicEscapePage.tsx`
  todavía calcula la ruta directa al punto seguro más cercano vía
  `evacuationService`; el cambio de hoy no tocó esa lógica, solo cómo se
  obtiene la ubicación de entrada.
- Decisión de equipo sobre el `TrustFeedbackWidget`.

---

# Paso 3 — Panel principal ilustrado (paisaje + logo)

Sin tocar ninguna lógica ni funcionalidad existente:

- Confirmado: la paleta Senda y Alertin como única mascota ya estaban
  aplicados en todo el código desde el Paso 1 (no había nada pendiente ahí).
- Nuevo: `src/components/brand/SendaHeroBanner.tsx` — panel ilustrado con
  cielo de atardecer degradado, cordillera en los tonos de marca (Nevado,
  Cielo), una ruta serpenteante en Ruta/naranja, Alertin (`alertin_principal.svg`)
  y el lockup "Senda" con el tagline "Infórmate · Prepárate · Actúa", tal
  como en el moodboard (pantalla "Comenzar →"). Es 100% visual: no crea
  rutas ni estados nuevos; el botón "Comenzar" solo hace scroll suave hacia
  el contenido que ya existía.
- Insertado en `HomePage.tsx` (la pantalla real de `/` y `/app`, con formato
  de teléfono como el moodboard), arriba de la cabecera de texto existente
  — no se quitó ni modificó nada de lo que ya había debajo.

## Pendiente (sigue igual)
- Submenú Prepararme (5 accesos).
- Lógica de escape en 2 etapas (lateral → refugio).
- Decisión de equipo sobre el `TrustFeedbackWidget`.

---

# Paso 4 — Fotos reales: paisaje en Inicio, montañas sutiles en el resto

- `public/assets/hero-landscape.jpg` — tu ilustración real (paisaje al
  atardecer con la ruta serpenteante), convertida de .jfif a .jpg para que
  se sirva bien desde el navegador. Reemplaza la ilustración SVG que había
  hecho yo en `SendaHeroBanner.tsx` (mismo componente, mismo lugar: el
  panel principal de la pestaña Inicio, con Alertin, el logo "Senda", el
  tagline y el botón "Comenzar").
- `public/assets/bg-montanas.svg` — tu `BG_montañas.svg` (renombrado sin
  ñ para evitar problemas de codificación en la URL). Nuevo componente
  `src/components/brand/MountainBackdrop.tsx`: lo pone de fondo fijo, a
  opacidad muy baja (7%), detrás del contenido.
- `MountainBackdrop` insertado en las otras 3 pestañas del BottomNav:
  Prevención (`PreventionCenterPage.tsx` y `AssessmentPage.tsx`, que
  comparten esa pestaña), Fuentes (`SourcesPage.tsx`) y Cuenta
  (`UserDashboardPage.tsx`). Cambio puramente visual: cada contenedor pasó
  a `relative` y su `<main>` a `relative z-10` para que el fondo quede
  detrás sin tapar nada.
- No toqué `PanicEscapePage.tsx` ni `NextStepsPage.tsx` — no son pestañas
  del BottomNav (el pánico se activa desde el botón central, no desde una
  pestaña). Aviso por si también quieres el fondo sutil ahí.

## Pendiente (sigue igual)
- Submenú Prepararme (5 accesos).
- Lógica de escape en 2 etapas (lateral → refugio).
- Decisión de equipo sobre el `TrustFeedbackWidget`.

---

# Paso 5 — Alertin acompañando los pasos (como en tu versión)

Portado el patrón de tu zip (Mapin/Nevadin acompañando cada paso →
reemplazados por Alertin, con tu paleta, ya que Alertin es la única
mascota). Usa el componente `MascotGuide` que ya existía en esta base
(mood="explaining", Alertin, tokens Senda).

- `AssessmentPage.tsx` — Paso 1 (ubicar la vivienda en el mapa): la
  instrucción cívica sin mascota que había se reemplazó por un
  `<MascotGuide compact mood="explaining">` con Alertin, mismo texto de
  ayuda que ya tenía.
- `HousingForm.tsx` — antes de la Pregunta 1 del cuestionario de 6
  preguntas, agregué el mismo consejo de Alertin que tu "Consejo de
  Nevadin" original (adaptado: aquí el formulario muestra las 6 preguntas
  en una sola página, no en subpasos como en tu versión, así que el
  consejo aparece una vez al inicio en vez de repetirse por subpaso).
- `AnalysisLoadingOverlay.tsx` — el spinner genérico que tenía la base se
  reemplazó por la burbuja de Alertin acompañando paso a paso (label +
  detail), igual que hacía Nevadin en tu versión. Se usa en las 2 pantallas
  de carga del flujo de evaluación (análisis espacial y cálculo de riesgo).

No toqué el modo Pánico ni el submenú Prepararme en este paso — si quieres
Alertin acompañando ahí también, dime y lo sumo.

## Pendiente (sigue igual)
- Submenú Prepararme (5 accesos).
- Lógica de escape en 2 etapas (lateral → refugio).
- Decisión de equipo sobre el `TrustFeedbackWidget`.
