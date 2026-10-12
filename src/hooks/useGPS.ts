import { useState, useCallback } from 'react';
import { Coordinates } from '../context/EvaluationContext';

// Coordenadas de Plaza de Armas de Huaraz como fallback interactivo confiable
export const HUARAZ_FALLBACK_COORDS: Coordinates = {
  lat: -9.5278,
  lng: -77.5278,
  accuracy: 15,
};

interface UseGPSResult {
  coordinates: Coordinates | null;
  error: string | null;
  isLocating: boolean;
  requestLocation: () => Promise<Coordinates>;
  setManualLocation: (coords: Coordinates) => void;
}

export const useGPS = (): UseGPSResult => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const requestLocation = useCallback((): Promise<Coordinates> => {
    setIsLocating(true);
    setError(null);

    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        setError('Tu navegador no soporta geolocalización. Usando ubicación de referencia en Huaraz.');
        setCoordinates(HUARAZ_FALLBACK_COORDS);
        setIsLocating(false);
        resolve(HUARAZ_FALLBACK_COORDS);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: Coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setCoordinates(coords);
          setIsLocating(false);
          resolve(coords);
        },
        (err) => {
          let message = 'No se pudo obtener la ubicación GPS precisa. Puedes ajustar el marcador en el mapa.';
          if (err.code === err.PERMISSION_DENIED) {
            message = 'Permiso de ubicación denegado. Puedes ubicar tu vivienda manualmente en el mapa.';
          }
          setError(message);
          setCoordinates(HUARAZ_FALLBACK_COORDS);
          setIsLocating(false);
          resolve(HUARAZ_FALLBACK_COORDS);
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 30000,
        }
      );
    });
  }, []);

  const setManualLocation = useCallback((coords: Coordinates) => {
    setCoordinates(coords);
    setError(null);
  }, []);

  return {
    coordinates,
    error,
    isLocating,
    requestLocation,
    setManualLocation,
  };
};
