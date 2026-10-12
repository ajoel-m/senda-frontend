import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Compass,
  ExternalLink,
  Footprints,
  Loader2,
  MapPin,
  Maximize2,
  Minimize2,
  ShieldCheck,
} from 'lucide-react';
import { LeafletMap } from '../components/map/LeafletMap';
import {
  calculateEvacuationRoute,
  EvacuationRouteResult,
} from '../services/evacuationService';
import { Coordinates } from '../context/EvaluationContext';
import { HazardType } from '../services/gisLayers';
import { useResolvedLocation } from '../hooks/useResolvedLocation';
import { hazardToAlertinSemaphore } from '../lib/alertin';

export const PanicEscapePage: React.FC = () => {
  const navigate = useNavigate();
  // Ubicación resuelta en cascada: GPS en vivo → última ubicación guardada
  // en este navegador (de /evaluar o de una visita anterior al Modo Pánico)
  // → punto de referencia en Huaraz. Ver hooks/useResolvedLocation.ts.
  const { coordinates, setCoordinates, source, isLocating } = useResolvedLocation();
  const [routeResult, setRouteResult] = useState<EvacuationRouteResult | null>(null);
  const [feedbackSent, setFeedbackSent] = useState<boolean | null>(null);
  const [isExpandedMap, setIsExpandedMap] = useState<boolean>(false);

  // En cuanto useResolvedLocation resuelve una ubicación (por cualquier
  // fuente), calcular la ruta de escape hacia ella.
  useEffect(() => {
    if (coordinates) {
      loadRoute(coordinates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates]);

  const setCoords = setCoordinates;
  const coords = coordinates;

  const loadRoute = async (c: Coordinates) => {
    const result = await calculateEvacuationRoute(c);
    setRouteResult(result);
  };

  const handleFeedback = (isHelpful: boolean) => {
    setFeedbackSent(isHelpful);
  };

  // Altura del mapa adaptativa según la longitud de la ruta a pie
  const dynamicMapHeight = useMemo(() => {
    if (isExpandedMap) return '520px';
    if (!routeResult || !routeResult.distanceMeters) return '360px';
    const dist = routeResult.distanceMeters;
    if (dist > 800) return '480px';
    if (dist > 400) return '420px';
    return '360px';
  }, [routeResult, isExpandedMap]);

  const activeThreatsSet = useMemo(() => new Set<HazardType>(['alluvium_inaigem']), []);

  // Semáforo de 3 colores (rojo/amarillo/verde) según la severidad real del
  // punto — antes esta página solo distinguía "dentro/fuera" de la faja,
  // así que un punto en severidad Media se mostraba igual que uno Crítico.
  // "Sin datos" se trata como amarillo (precaución), nunca como verde
  // falso — no confirmamos "seguro" cuando en realidad no lo sabemos.
  const alertin = useMemo(() => {
    if (!routeResult) return null;
    if (routeResult.isInsideHazard && routeResult.hazardLevel) {
      return hazardToAlertinSemaphore({ severity: routeResult.hazardLevel });
    }
    if (routeResult.hasData === false) {
      return hazardToAlertinSemaphore({ severity: 'medium' });
    }
    return hazardToAlertinSemaphore(null);
  }, [routeResult]);
  const isRojo = alertin?.variant === 'alertin_rojo';
  const isAmarillo = alertin?.variant === 'alertin_amarillo';

  // Colapsable, pero nunca escondida si el riesgo es alto: cuando es rojo,
  // se mantiene expandida automáticamente (las instrucciones de escape no
  // deben requerir un toque extra para verse). En amarillo/verde, la
  // persona puede plegarla para una vista más limpia.
  const [showBannerDetail, setShowBannerDetail] = useState(false);
  useEffect(() => {
    if (isRojo) setShowBannerDetail(true);
  }, [isRojo]);

  if (isLocating || !coords) {
    return (
      <div className="w-full min-h-[calc(100vh-130px)] bg-transparent text-ink-primary pb-24 pt-4 px-4 sm:px-6 relative">
        <div className="max-w-md mx-auto flex items-center gap-3 bg-canvas-surface border border-border-subtle rounded-2xl p-4 text-ink-muted text-sm mt-4">
          <Loader2 className="w-5 h-5 animate-spin shrink-0 text-sky-700" />
          Buscando tu ubicación...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-130px)] bg-transparent text-ink-primary pb-24 pt-4 px-4 sm:px-6 relative">
      <main className="max-w-md mx-auto space-y-4">
        {/* Cabecera de Escape Inmediato */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <button
            type="button"
            onClick={() => navigate('/app')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-ink-primary"
          >
            <ArrowLeft size={16} />
            <span>Volver</span>
          </button>

          {alertin && (
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1.5"
              style={{
                color: alertin.color,
                backgroundColor: `${alertin.color}12`,
                borderColor: `${alertin.color}40`,
              }}
            >
              <img src={`/mascots/${alertin.variant}.svg`} alt="" className="w-4 h-4" aria-hidden="true" />
              {isRojo ? 'Alerta Aluvión' : isAmarillo ? 'Precaución Aluvión' : 'Ubicación Fuera de Riesgo'}
            </span>
          )}
        </div>

        {/* Alertin en vivo: cambia de color y expresión según la severidad
            real detectada en el punto (no solo "dentro/fuera") */}
        {alertin && (
          <div
            className="rounded-2xl p-3 bg-canvas-surface border flex items-center gap-3 transition-colors duration-300"
            style={{ borderColor: `${alertin.color}55` }}
          >
            <div
              className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center overflow-hidden border"
              style={{ backgroundColor: `${alertin.color}1A`, borderColor: `${alertin.color}55` }}
            >
              <img
                src={`/mascots/${alertin.variant}.svg`}
                alt="Alertin indicando el nivel de riesgo en este punto"
                className="w-[85%] h-[85%] object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: alertin.color }}>
                {alertin.label}
              </p>
              <p className="text-xs text-ink-muted leading-snug">
                Alertin cambia según la severidad real en tu ubicación actual.
              </p>
            </div>
          </div>
        )}

        {/* Banner de Instrucción Paso 1 (Mockup Vista 3) */}
        <div
          className={`bg-canvas-surface rounded-2xl p-4 shadow-xs space-y-2 border-2 ${
            isRojo ? 'border-emergency-600' : isAmarillo ? 'border-dawn-amber' : 'border-life-600/40'
          }`}
        >
          <button
            type="button"
            onClick={() => setShowBannerDetail((v) => !v)}
            className="w-full flex items-start gap-3 text-left"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                isRojo
                  ? 'bg-emergency-50 text-emergency-600'
                  : isAmarillo
                  ? 'bg-dawn-amberSurface text-dawn-amber'
                  : 'bg-life-50 text-life-600'
              }`}
            >
              {isRojo ? (
                <AlertTriangle size={18} />
              ) : isAmarillo ? (
                <Compass size={18} />
              ) : (
                <ShieldCheck size={18} />
              )}
            </div>
            <div className="flex-1">
              <span
                className={`text-xs font-extrabold uppercase block ${
                  isRojo ? 'text-emergency-600' : isAmarillo ? 'text-dawn-amber' : 'text-life-600'
                }`}
              >
                {isRojo
                  ? 'PASO 1: SALIR DE LA ZONA ROJA'
                  : isAmarillo
                  ? 'ZONA DE PRECAUCIÓN'
                  : 'UBICACIÓN SEGURA'}
              </span>
              <h2 className="text-base font-bold text-ink-primary leading-snug">
                {isRojo
                  ? '¡Estás en zona de flujo! Avanza a la ladera alta más cercana.'
                  : isAmarillo
                  ? 'Riesgo medio en tu zona. Mantente atento y ubica tu ruta de salida.'
                  : 'Fuera de la zona de flujo. Dirígete a la zona segura.'}
              </h2>
            </div>
            <ChevronDown
              size={16}
              className={`shrink-0 mt-1 text-ink-muted transition-transform ${showBannerDetail ? 'rotate-180' : ''}`}
            />
          </button>

          {showBannerDetail && (
            <p className="text-xs text-ink-muted pl-11">
              {routeResult?.instructions || 'Calculando la ruta peatonal más corta hacia refugio...'}
            </p>
          )}
        </div>

        {/* Indicador de fuente de ubicación */}
        <div className="flex items-center gap-1.5 text-[11px] text-ink-muted px-1">
          <MapPin size={13} />
          {source === 'gps' && 'Usando tu ubicación GPS en tiempo real.'}
          {source === 'guardada' &&
            'GPS no disponible: usando tu última ubicación guardada en este navegador.'}
          {source === 'referencia' &&
            'GPS no disponible: mostrando una ubicación de referencia. Activa tu GPS para mayor precisión.'}
        </div>

        {/* Barra de control superior del mapa con botón de agrandar */}
        <div className="flex items-center justify-between px-1 text-xs text-ink-muted">
          <span className="font-semibold text-[11px] text-sky-700">
            {isRojo
              ? 'Faja de peligro aluvial en tono opaco + ruta en rojo'
              : 'Faja de peligro aluvial en tono opaco + ruta hacia zona segura'}
          </span>
          <button
            type="button"
            onClick={() => setIsExpandedMap((prev) => !prev)}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-canvas-surface border border-border-subtle rounded-lg font-bold text-[11px] text-ink-primary hover:bg-canvas-glacial transition-colors shadow-2xs cursor-pointer"
          >
            {isExpandedMap ? (
              <>
                <Minimize2 size={12} className="text-sky-700" />
                <span>Vista Normal</span>
              </>
            ) : (
              <>
                <Maximize2 size={12} className="text-sky-700" />
                <span>Agrandar Mapa</span>
              </>
            )}
          </button>
        </div>

        {/* Visor de Mapa Leaflet con polígono atenuado y altura dinámica */}
        <div className="bg-canvas-surface border border-border-subtle rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
          <LeafletMap
            coordinates={coords}
            onChangeCoordinates={(newCoords) => {
              setCoords(newCoords);
              loadRoute(newCoords);
            }}
            height={dynamicMapHeight}
            cleanMode={false}
            fadedHazards={true}
            externalActiveThreats={activeThreatsSet}
            externalRoute={routeResult}
            showBottomAlert={false}
            hideInternalControls={true}
          />
        </div>

        {/* INDICACIONES DETALLADAS DE LA RUTA EN TEXTO DEBAJO DEL MAPA */}
        {routeResult && (
          <div className="bg-canvas-surface border border-border-subtle rounded-2xl p-4 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
              <div className="flex items-center gap-2">
                <Footprints size={18} className="text-sky-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-ink-primary">
                  Indicaciones de la Ruta
                </span>
              </div>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-sm">
                ~{routeResult.estimatedTimeMinutes} min ({routeResult.distanceMeters} m)
              </span>
            </div>

            {/* Pasos textuales directos */}
            <div className="space-y-2.5 text-xs text-ink-primary">
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-5 h-5 rounded-full text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 ${
                    isRojo ? 'bg-emergency-600' : isAmarillo ? 'bg-dawn-amber' : 'bg-life-600'
                  }`}
                >
                  1
                </div>
                <div>
                  <strong
                    className={`block ${
                      isRojo ? 'text-emergency-600' : isAmarillo ? 'text-dawn-amber' : 'text-life-600'
                    }`}
                  >
                    {isRojo ? 'Salida de zona de peligro:' : isAmarillo ? 'Precaución en tu punto:' : 'Condición de tu punto:'}
                  </strong>
                  <span className="text-ink-muted">
                    {isRojo
                      ? 'Camina de inmediato en dirección perpendicular al cauce del río Quillcay hacia la calle o ladera alta más cercana.'
                      : isAmarillo && routeResult.hasData === false
                      ? 'No se registran datos oficiales de faja de flujo en esta zona. Mantente en zonas altas y despejadas.'
                      : isAmarillo
                      ? 'Riesgo medio detectado. No es necesario huir, pero ubica tu ruta de salida por si el riesgo aumenta.'
                      : 'Te encuentras fuera de la faja principal de impacto aluvial.'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-sky-700 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <strong className="block text-sky-700">Destino habilitado:</strong>
                  <span className="font-semibold text-ink-primary block">
                    {routeResult.destination.nombre} ({routeResult.destination.sector})
                  </span>
                  <span className="text-ink-muted">
                    Zona segura oficial delimitada por la Municipalidad Provincial de Huaraz y Defensa Civil.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-ink-primary text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <strong className="block text-ink-primary">Regla de supervivencia:</strong>
                  <span className="text-ink-muted">
                    Avanza estrictamente a pie. No intentes cruzar puentes sobre el río ni usar autos o mototaxis.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={routeResult.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 bg-canvas-glacial hover:bg-sky-50 border border-border-subtle text-ink-primary text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <span>Abrir indicación paso a paso en GPS</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )}

        {/* Micro-Card de Evaluación Cívica (Mockup Vista 3) */}
        <div className="bg-canvas-surface border border-border-subtle rounded-xl p-3 text-center space-y-2">
          {feedbackSent === null ? (
            <>
              <span className="text-xs font-semibold text-ink-primary block">
                ¿Te resultó útil y clara esta ruta?
              </span>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleFeedback(true)}
                  className="px-4 py-1.5 min-h-[36px] bg-canvas-surface border border-border-subtle hover:bg-life-50 text-xs font-bold text-life-600 rounded-lg shadow-2xs"
                >
                  Sí, fue clara
                </button>
                <button
                  type="button"
                  onClick={() => handleFeedback(false)}
                  className="px-4 py-1.5 min-h-[36px] bg-canvas-surface border border-border-subtle hover:bg-emergency-surface text-xs font-bold text-emergency-600 rounded-lg shadow-2xs"
                >
                  No, confusa
                </button>
              </div>
            </>
          ) : (
            <span className="text-xs font-bold text-life-600 flex items-center justify-center gap-1.5">
              <CheckCircle2 size={16} />
              ¡Gracias! Tu opinión nos ayuda a salvar vidas.
            </span>
          )}
        </div>
      </main>
    </div>
  );
};
