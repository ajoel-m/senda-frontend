import { SeverityLevel } from '../services/gisLayers';

export type AlertinSemaphoreVariant = 'alertin_rojo' | 'alertin_amarillo' | 'alertin_verde';

export interface AlertinSemaphoreState {
  variant: AlertinSemaphoreVariant;
  color: string;
  label: string;
}

/**
 * Traduce la severidad detectada bajo el marcador (la "peor" entre las
 * capas activas, calculada por findIntersectingHazards) al semáforo de
 * 3 colores de Alertin. Alto y Crítico comparten el rojo — Alertin no
 * tiene un 4to color — según lo acordado con el equipo.
 *
 * El verde reutiliza el token `life` (#059669) ya definido en
 * tailwind.config.js como excepción intencional de marca (Senda no
 * define un verde propio); es el mismo color que ya usan "zona segura /
 * GPS activo" en el resto de la app.
 */
export function hazardToAlertinSemaphore(
  hazard: { severity: SeverityLevel } | null
): AlertinSemaphoreState {
  if (!hazard || hazard.severity === 'low') {
    return { variant: 'alertin_verde', color: '#059669', label: hazard ? 'Riesgo bajo en este punto' : 'Zona segura detectada' };
  }
  if (hazard.severity === 'medium') {
    return { variant: 'alertin_amarillo', color: '#FFD166', label: 'Riesgo medio en este punto' };
  }
  // 'high' y 'critical' comparten el rojo
  return { variant: 'alertin_rojo', color: '#E63950', label: 'Riesgo alto en este punto' };
}
