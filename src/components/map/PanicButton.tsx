import React, { useState } from 'react';
import { AlertOctagon, Navigation, Shield, ExternalLink, X, Compass, Loader2 } from 'lucide-react';
import { Coordinates } from '../../context/EvaluationContext';
import { EvacuationRouteResult, calculateEvacuationRoute } from '../../services/evacuationService';

interface PanicButtonProps {
  currentCoordinates: Coordinates;
  onEvacuationRouteCalculated: (route: EvacuationRouteResult | null) => void;
  onRequestLiveLocation?: () => Promise<Coordinates>;
}

export const PanicButton: React.FC<PanicButtonProps> = ({
  currentCoordinates,
  onEvacuationRouteCalculated,
  onRequestLiveLocation,
}) => {
  const [isActivating, setIsActivating] = useState(false);
  const [activeRoute, setActiveRoute] = useState<EvacuationRouteResult | null>(null);

  const handleTriggerPanic = async () => {
    setIsActivating(true);
    try {
      let coords = currentCoordinates;
      if (onRequestLiveLocation) {
        try {
          coords = await onRequestLiveLocation();
        } catch (e) {
          console.warn('Fallo al obtener ubicación GPS en vivo para pánico:', e);
        }
      }

      const result = await calculateEvacuationRoute(coords);
      if (result) {
        setActiveRoute(result);
        onEvacuationRouteCalculated(result);
      }
    } catch (error) {
      console.error('Error calculando ruta de pánico:', error);
    } finally {
      setIsActivating(false);
    }
  };

  const handleCloseEvacuation = () => {
    setActiveRoute(null);
    onEvacuationRouteCalculated(null);
  };

  return (
    <>
      {/* Botón Flotante de Pánico */}
      {!activeRoute && (
        <button
          type="button"
          onClick={handleTriggerPanic}
          disabled={isActivating}
          className="group relative flex items-center gap-2 bg-emergency-600 hover:bg-emergency-700 text-white font-bold py-2.5 px-4 rounded-full shadow-lg hover:shadow-emergency-600/30 transition-all duration-200 active:scale-95 disabled:opacity-75"
          title="Activar Botón de Pánico: Ruta más corta a la zona segura más cercana"
        >
          {isActivating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-xs uppercase tracking-wider">Trazando escape...</span>
            </>
          ) : (
            <>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emergency-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <AlertOctagon className="w-5 h-5" />
              <span className="text-xs sm:text-sm uppercase tracking-wide">Ruta de Evacuación</span>
            </>
          )}
        </button>
      )}

      {/* Tarjeta Flotante de Emergencia Activa */}
      {activeRoute && (
        <div
          className={`absolute top-4 left-4 right-4 z-[1100] sm:left-auto sm:right-4 sm:w-96 bg-canvas-surface text-ink-primary border-2 ${
            activeRoute.isInsideHazard ? 'border-emergency-600' : 'border-sky-600'
          } rounded-2xl shadow-xl p-4 animate-in fade-in slide-in-from-top-4 duration-300`}
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    activeRoute.isInsideHazard ? 'bg-emergency-400' : 'bg-sky-400'
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    activeRoute.isInsideHazard ? 'bg-emergency-600' : 'bg-sky-600'
                  }`}
                ></span>
              </span>
              <h4
                className={`text-sm font-black uppercase tracking-wider flex items-center gap-1.5 ${
                  activeRoute.isInsideHazard ? 'text-emergency-600' : 'text-sky-700'
                }`}
              >
                <Shield className="w-4 h-4" />
                {activeRoute.isInsideHazard ? 'Ruta de Escape Activa' : 'Ruta hacia Zona Segura'}
              </h4>
            </div>
            <button
              type="button"
              onClick={handleCloseEvacuation}
              className="text-ink-muted hover:text-ink-primary p-1 rounded-lg hover:bg-canvas-glacial transition-colors"
              title="Cerrar ruta"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-canvas-glacial rounded-xl p-3 border border-border-subtle mb-3">
            <div className="text-xs text-ink-muted mb-1">Punto Seguro de Destino:</div>
            <div className="font-bold text-ink-primary text-base flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-sky-600 shrink-0" />
              {activeRoute.destination.nombre}
            </div>
            <div className="text-xs text-ink-muted mt-0.5">
              Sector {activeRoute.destination.sector} •{' '}
              <span className="capitalize text-sky-700 font-semibold">
                {activeRoute.destination.tipo === 'refugio_temp' ? 'Refugio Temporal' : 'Zona Segura'}
              </span>
            </div>
          </div>

          <p className="text-xs text-ink-muted mb-3 leading-relaxed">
            {activeRoute.instructions}
          </p>

          <div className="grid grid-cols-2 gap-2 mb-3 text-center">
            <div className="bg-canvas-glacial rounded-lg p-2 border border-border-subtle">
              <div className="text-[10px] text-ink-muted uppercase tracking-wider">Distancia</div>
              <div className="text-base font-black text-sky-700">
                {activeRoute.distanceMeters >= 1000
                  ? `${(activeRoute.distanceMeters / 1000).toFixed(1)} km`
                  : `${activeRoute.distanceMeters} m`}
              </div>
            </div>
            <div className="bg-canvas-glacial rounded-lg p-2 border border-border-subtle">
              <div className="text-[10px] text-ink-muted uppercase tracking-wider">Tiempo a pie</div>
              <div className="text-base font-black text-life-600">
                ~{activeRoute.estimatedTimeMinutes} min
              </div>
            </div>
          </div>

          {activeRoute.isOfflineFallback && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#B36A16] mb-3 bg-dawn-amberSurface border border-dawn-amber/40 rounded-lg p-2">
              <Compass className="w-3.5 h-3.5 shrink-0 text-[#B36A16]" />
              <span>Modo Resiliente: Línea recta de emergencia por desconexión.</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <a
              href={activeRoute.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition-all shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Navegar en Google Maps
            </a>
            <button
              type="button"
              onClick={handleCloseEvacuation}
              className="text-xs font-semibold py-2 px-3 bg-canvas-glacial hover:bg-sky-50 text-ink-primary border border-border-subtle rounded-xl transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
