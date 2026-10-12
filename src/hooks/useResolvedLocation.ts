import { useEffect, useState, useCallback } from 'react';
import { Coordinates } from '../context/EvaluationContext';
import { readPendingLocation } from '../lib/pendingLocation';

export type LocationSource = 'gps' | 'guardada' | 'referencia';

const HUARAZ_FALLBACK_COORDS: Coordinates = { lat: -9.528, lng: -77.528 };

function getLiveLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalización no disponible'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
          accuracy: pos.coords.accuracy,
        }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });
}

/**
 * Resuelve una ubicación para el Modo Pánico sin frenar al usuario pidiendo
 * que la elija a mano: intenta GPS en vivo primero; si falla o tarda, usa la
 * última ubicación guardada en este navegador (la misma que guarda /evaluar
 * al usar GPS o el mapa); si tampoco hay, cae a un punto de referencia en
 * Huaraz. Expone `source` para que la UI indique de dónde salió la ubicación
 * mostrada.
 *
 * Portado de web-app_MIA_AMY/src/hooks/useResolvedLocation.ts.
 */
export function useResolvedLocation() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [source, setSource] = useState<LocationSource>('referencia');
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const live = await getLiveLocation();
        if (!cancelled) {
          setCoordinates(live);
          setSource('gps');
        }
      } catch {
        const pending = readPendingLocation();
        if (!cancelled) {
          if (pending) {
            setCoordinates(pending);
            setSource('guardada');
          } else {
            setCoordinates(HUARAZ_FALLBACK_COORDS);
            setSource('referencia');
          }
        }
      } finally {
        if (!cancelled) setIsLocating(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const refreshWithLiveGps = useCallback(async () => {
    const live = await getLiveLocation();
    setCoordinates(live);
    setSource('gps');
    return live;
  }, []);

  return { coordinates, setCoordinates, source, isLocating, refreshWithLiveGps };
}
