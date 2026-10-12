import { Coordinates } from '../context/EvaluationContext';

/**
 * Última ubicación conocida en este navegador, compartida entre el flujo de
 * evaluación de vivienda y el Modo Pánico: si el usuario ya dio su ubicación
 * (GPS o mapa) en /evaluar, el Modo Pánico la reutiliza sin volver a pedirla
 * cuando el GPS en vivo no está disponible en el momento de la emergencia.
 *
 * Portado de la versión anterior de Amy (web-app_MIA_AMY), donde vivía
 * dentro de LandingPage.tsx bajo el nombre persistPendingLocation /
 * readPendingLocation con la misma clave de sessionStorage.
 */
const LOCATION_STORAGE_KEY = 'mcs_pending_location';

export function persistPendingLocation(location: Coordinates): void {
  try {
    sessionStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
  } catch {
    // sessionStorage no disponible (modo privado, SSR, etc.) — no es crítico.
  }
}

export function readPendingLocation(): Coordinates | null {
  try {
    const raw = sessionStorage.getItem(LOCATION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Coordinates;
  } catch {
    return null;
  }
}
