import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  MapPin,
  ArrowRight,
  RotateCcw,
  Lock,
  Info,
  Footprints,
  ExternalLink,
} from 'lucide-react';
import { LeafletMap } from '../components/map/LeafletMap';
import { hazardToAlertinSemaphore } from '../lib/alertin';
import { persistPendingLocation } from '../lib/pendingLocation';
import { MountainBackdrop } from '../components/brand/MountainBackdrop';
import { MascotGuide } from '../components/MascotGuide';
import { HousingForm } from '../components/forms/HousingForm';
import { CleanAssessmentResult } from '../components/results/CleanAssessmentResult';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import {
  AnalysisLoadingOverlay,
  AnalysisStep,
} from '../components/loading/AnalysisLoadingOverlay';
import {
  calculateVulnerability,
  calculateMultiHazardRisk,
  HazardScores,
  QuestionnaireAnswers,
} from '../lib/riskEngine';
import {
  checkSpatialRisk,
  detectTerritorialProfile,
  saveEvaluationRecord,
  SpatialRiskResult,
} from '../services/supabase';
import { IntersectingHazardResult, HazardType } from '../services/gisLayers';
import { Waves, Activity, Mountain } from 'lucide-react';
import {
  calculateEvacuationRoute,
  EvacuationRouteResult,
} from '../services/evacuationService';

const HUARAZ_FALLBACK_COORDS = { lat: -9.528, lng: -77.528 };
const LIMA_FALLBACK_COORDS = { lat: -12.046, lng: -77.030 };

const SPATIAL_ANALYSIS_STEPS: AnalysisStep[] = [
  {
    id: 'coords',
    label: 'Georreferenciación WGS-84 y Catastro',
    detail: 'Verificando coordenadas geodésicas y cuadrante territorial provincial.',
  },
  {
    id: 'seismic',
    label: 'Microzonificación Sísmica (CISMID / RNE E.030)',
    detail: 'Determinando tipo de suelo, respuesta dinámica y factor de amplificación.',
  },
  {
    id: 'alluvium',
    label: 'Peligrosidad de Aluvión (INAIGEM / CENEPRED)',
    detail: 'Identificando cuenca hidrológica y fajas de impacto por flujo de detritos.',
  },
  {
    id: 'landslide',
    label: 'Susceptibilidad a Movimientos en Masa (SIGRID)',
    detail: 'Evaluando historial de avalanchas, desbordes y pendientes críticas.',
  },
  {
    id: 'profile',
    label: 'Consolidación de Perfil Territorial',
    detail: 'Estructurando factores de amenaza oficial para la edificación.',
  },
];

const RISK_CALCULATION_STEPS: AnalysisStep[] = [
  {
    id: 'vulnerability',
    label: 'Evaluación de Vulnerabilidad Física (RNE)',
    detail: 'Cruzando materialidad, confinamiento y estado de conservación.',
  },
  {
    id: 'triggers',
    label: 'Auditoría de Infracciones Críticas RNE',
    detail: 'Comprobando normas E.070 (Albañilería) y E.080 (Construcción con Adobe).',
  },
  {
    id: 'ahp',
    label: 'Modelado Multicriterio AHP Saaty (CENEPRED)',
    detail: 'Ponderando consistencia matemática de la matriz de riesgo.',
  },
  {
    id: 'mitigation',
    label: 'Emisión de Dictamen y Plan de Mitigación',
    detail: 'Estructurando recomendaciones técnicas y mochila de emergencia INDECI.',
  },
];

const mapRiskLevelToScore = (level?: string | null): number | null => {
  if (!level) return null;
  const l = level.toLowerCase().trim();
  if (l === 'none' || l === 'sin afectacion' || l === 'no_hazard' || l === 'fuera de peligro') {
    return 0.0;
  }
  if (l === 'insufficient_data' || l === 'desconocido' || l === 'unknown' || l === 'sin datos') {
    return null;
  }
  if (l.includes('crit') || l.includes('muy alto')) return 1.0;
  if (l.includes('high') || l.includes('alto')) return 0.75;
  if (l.includes('medium') || l.includes('medio')) return 0.5;
  if (l.includes('low') || l.includes('bajo')) return 0.25;
  return null;
};

const INITIAL_ANSWERS: QuestionnaireAnswers = {
  material: 'king_kong',
  confinamiento: 'confinado_total',
  pisos: '2_pisos',
  conservacion: 'muros_secos',
  asistenciaTecnica: 'maestro_obra',
  sitioGeotecnico: 'sitio_firme',
};

export const AssessmentPage: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading: isAuthLoading, openAuthModal } = useAuth();

  // Estado local para navegación de pasos
  const [step, setStep] = useState<'location' | 'assessment' | 'results'>('location');
  const [coordinates, setCoordinates] = useState(HUARAZ_FALLBACK_COORDS);
  const [isLocating, setIsLocating] = useState(false);
  const [isAnalyzingSpatial, setIsAnalyzingSpatial] = useState(false);
  const [isCalculatingRisk, setIsCalculatingRisk] = useState(false);
  const [spatialResult, setSpatialResult] = useState<SpatialRiskResult | null>(null);
  const [localHazard, setLocalHazard] = useState<IntersectingHazardResult | null>(null);
  const [cityId, setCityId] = useState<'huaraz' | 'lima'>('huaraz');
  const [savedEvalId, setSavedEvalId] = useState<string | null>(null);
  const [activeThreats, setActiveThreats] = useState<Set<HazardType>>(
    new Set<HazardType>(['alluvium_inaigem', 'landslide', 'seismic', 'seismic_lima'])
  );
  const [showEscapeRoute, setShowEscapeRoute] = useState<boolean>(false);
  const [escapeRoute, setEscapeRoute] = useState<EvacuationRouteResult | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState<boolean>(false);

  // La ruta de escape solo está disponible si la capa de aluvión está activa
  const isAlluviumActive = activeThreats.has('alluvium_inaigem');

  // Si se desactiva la capa de aluviones, ocultar y limpiar la ruta de escape automáticamente
  useEffect(() => {
    if (!isAlluviumActive) {
      setShowEscapeRoute(false);
      setEscapeRoute(null);
    }
  }, [isAlluviumActive]);

  const loadEscapeRoute = async (coords: { lat: number; lng: number }) => {
    setIsCalculatingRoute(true);
    try {
      const res = await calculateEvacuationRoute(coords);
      setEscapeRoute(res);
    } catch (err) {
      console.error('Error al calcular ruta de escape:', err);
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  // Recalcular ruta ante cambios de coordenadas si la ruta está activa y la capa de aluviones encendida
  useEffect(() => {
    if (showEscapeRoute && isAlluviumActive) {
      loadEscapeRoute(coordinates);
    }
  }, [coordinates, showEscapeRoute, isAlluviumActive]);

  const handleToggleEscapeRoute = () => {
    if (!isAlluviumActive) return;
    const nextState = !showEscapeRoute;
    setShowEscapeRoute(nextState);
    if (nextState) {
      loadEscapeRoute(coordinates);
    } else {
      setEscapeRoute(null);
    }
  };

  const toggleThreat = (threat: HazardType) => {
    setActiveThreats((prev) => {
      const next = new Set(prev);
      if (next.has(threat)) {
        if (next.size > 1) next.delete(threat);
      } else {
        next.add(threat);
      }
      return next;
    });
  };

  // Abrir automáticamente el modal de autenticación si se accede a la ruta sin login
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      openAuthModal('/evaluar');
    }
  }, [isAuthLoading, isAuthenticated, openAuthModal]);

  // Referencias para retener resultados en transiciones asíncronas
  const pendingSpatialResultRef = useRef<SpatialRiskResult | null>(null);

  // Respuestas del cuestionario canónico RNE
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({ ...INITIAL_ANSWERS });

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización GPS.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const coords = {
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
        };
        setCoordinates(coords);
        persistPendingLocation(coords);
        const detected = detectTerritorialProfile(coords);
        setCityId(detected.id);
      },
      (err) => {
        setIsLocating(false);
        console.warn('GPS error, using fallback:', err.message);
        setCoordinates(HUARAZ_FALLBACK_COORDS);
        setCityId('huaraz');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleMapChange = (coords: typeof HUARAZ_FALLBACK_COORDS) => {
    setCoordinates(coords);
    persistPendingLocation(coords);
    const detected = detectTerritorialProfile(coords);
    setCityId(detected.id);
  };

  const handleProceedToForm = async () => {
    setIsAnalyzingSpatial(true);
    let result = await checkSpatialRisk(coordinates);

    // Si la llamada RPC remota no tiene datos o falló, pero el cliente detectó intersección con las capas vectoriales oficiales
    if ((result.hazard_type === 'none' || result.risk_level === 'low') && localHazard) {
      const canonicalThreat: 'alluvium' | 'landslide' | 'seismic' = localHazard.threat.startsWith('alluvium')
        ? 'alluvium'
        : localHazard.threat.startsWith('seismic')
        ? 'seismic'
        : (localHazard.threat as 'landslide');

      result = {
        ...result,
        hazard_type: canonicalThreat,
        risk_level: localHazard.severity,
        worst_hazard_type: canonicalThreat,
        worst_risk_level: localHazard.severity,
        zone_name: localHazard.zoneName,
        description: localHazard.description,
        hazards: {
          ...result.hazards,
          [canonicalThreat]: {
            risk_level: localHazard.severity,
            zone_name: localHazard.zoneName,
            source: localHazard.source,
            description: localHazard.description,
          },
        },
      };
    }

    pendingSpatialResultRef.current = result;
  };

  const handleSpatialAnalysisComplete = () => {
    const finalResult = pendingSpatialResultRef.current || {
      hazard_type: 'none',
      risk_level: 'none',
      zone_name: 'Zona Urbana Consolidada',
      description: 'Sin afectación directa registrada.',
      territorial_profile: detectTerritorialProfile(coordinates),
    };

    setSpatialResult(finalResult);
    const detectedId = finalResult.territorial_profile?.id || detectTerritorialProfile(coordinates).id;
    setCityId(detectedId);
    setIsAnalyzingSpatial(false);
    setStep('assessment');
  };

  // Determinar los niveles de peligro para cada amenaza respetando la cartografía real
  const resolveHazardScore = (hazardKey: 'alluvium' | 'seismic' | 'landslide'): number | null => {
    // Si la ciudad no contempla esa amenaza (ej. aluvión en Lima Metropolitana), retornar undefined
    if (cityId === 'lima' && hazardKey === 'alluvium') {
      return undefined as any;
    }

    // 1. Si hay detalle específico en hazards
    const specific = spatialResult?.hazards?.[hazardKey];
    if (specific?.risk_level) {
      return mapRiskLevelToScore(specific.risk_level);
    }

    // 2. Si el hazard principal coincide
    if (spatialResult?.hazard_type === hazardKey) {
      return mapRiskLevelToScore(spatialResult.risk_level);
    }

    // 3. Si es sismo, por defecto en Perú (Zona 3 o 4) hay peligro base sismorresistente medio
    if (hazardKey === 'seismic') {
      return 0.50; // Peligro base medio según RNE E.030
    }

    // 4. Si la cartografía fue analizada y el punto no interseca la amenaza (aluvión o deslizamiento)
    if (spatialResult) {
      return 0.0; // Sin afectación directa registrada
    }

    // 5. Si aún no se analiza o no hay datos
    return null;
  };

  const hazardScores: HazardScores = {
    aluvion: resolveHazardScore('alluvium'),
    sismo: resolveHazardScore('seismic'),
    movimiento_masa: resolveHazardScore('landslide'),
  };

  const vulnerability = calculateVulnerability(answers, cityId);
  const multiHazardRisk = calculateMultiHazardRisk(vulnerability, hazardScores, cityId);

  const handleCalculateResults = async () => {
    setIsCalculatingRisk(true);
    const res = await saveEvaluationRecord({
      user_id: user?.id,
      lat: coordinates.lat,
      lon: coordinates.lng,
      cityId,
      material: answers.material,
      numero_pisos:
        answers.pisos === '1_piso'
          ? 1
          : answers.pisos === '2_pisos'
          ? 2
          : answers.pisos === '3_pisos'
          ? 3
          : 4,
      vulnerabilidad_calculada: vulnerability.level,
      riesgo_total_calculado: multiHazardRisk.globalRiskLevel,
      detalle_evaluacion: {
        answers,
        hardTriggers: vulnerability.hardTriggers,
        normalizedVulnerability: vulnerability.normalizedScore,
        globalScore: multiHazardRisk.globalRiskScore,
        criticalHazard: multiHazardRisk.criticalHazard,
      },
    });

    if (res.success && res.id) {
      setSavedEvalId(res.id);
    }
  };

  const handleRiskCalculationComplete = () => {
    setIsCalculatingRisk(false);
    setStep('results');
  };

  const handleResetAnswers = () => {
    try {
      localStorage.removeItem('mi_casa_segura_answers_cache');
      localStorage.removeItem('mi_casa_segura_pending_answers');
    } catch {
      // Ignorar modo incógnito
    }
    setAnswers({ ...INITIAL_ANSWERS });
  };

  const handleRestart = () => {
    try {
      localStorage.removeItem('mi_casa_segura_answers_cache');
      localStorage.removeItem('mi_casa_segura_pending_answers');
    } catch {
      // Ignorar modo incógnito
    }
    setStep('location');
    setAnswers({ ...INITIAL_ANSWERS });
    setSpatialResult(null);
    setLocalHazard(null);
    setSavedEvalId(null);
    pendingSpatialResultRef.current = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reiniciar estado cada vez que se navega a /evaluar desde otra pantalla
  useEffect(() => {
    handleRestart();
  }, [location.key]);

  return (
    <div className="w-full min-h-[calc(100vh-130px)] bg-transparent text-ink-primary py-8 px-4 sm:px-6 relative">
      <MountainBackdrop />
      <main className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* ------------------------------------------------------------------
            GUARDIA DE AUTENTICACIÓN GOOGLE OAUTH
            ------------------------------------------------------------------ */}
        {!isAuthLoading && !isAuthenticated && (
          <section className="p-8 sm:p-12 border border-border-subtle bg-canvas-surface rounded-2xl text-center space-y-6 max-w-xl mx-auto my-8 shadow-sm">
            <div className="w-14 h-14 mx-auto bg-sky-50 text-sky-700 flex items-center justify-center rounded-2xl border border-border-subtle">
              <Lock size={28} />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-sky-700 font-bold block">
                Acceso Ciudadano Protegido
              </span>
              <h1 className="font-display text-2xl font-black text-ink-primary">
                Inicia sesión para evaluar tu casa
              </h1>
              <p className="text-sm text-ink-muted leading-relaxed">
                Para consultar los mapas oficiales del CISMID, INAIGEM y CENEPRED, y guardar o descargar tu dictamen técnico en PDF, accede con tu cuenta de Google.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <Button
                onClick={() => openAuthModal('/evaluar')}
                variant="primary"
                size="lg"
                className="flex items-center justify-center gap-2.5"
              >
                {/* SVG Oficial de Google */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#FFFFFF"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#FFFFFF"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FFFFFF"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#FFFFFF"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Ingresar con Google</span>
              </Button>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------------
            PASO 1: LOCALIZACIÓN DEL PREDIO (MAPA LEAFLET CON CAPAS DE PELIGRO)
            ------------------------------------------------------------------ */}
        {isAuthenticated && step === 'location' && (
          <section className="space-y-6">
            <div className="border-b border-border-subtle pb-4">
              <span className="text-xs uppercase tracking-widest text-sky-700 font-bold">
                Paso 1 de 3
              </span>
              <h1 className="font-display text-2xl font-black text-ink-primary mt-1">
                Ubica tu Casa en el Mapa
              </h1>
              <p className="text-ink-muted text-sm mt-2 leading-relaxed">
                Indica la ubicación exacta de tu casa para cruzarla con los mapas oficiales de aluviones del INAIGEM y microzonificación sísmica del CISMID.
              </p>
            </div>

            {/* Consejo de Alertin (antes: instrucción cívica sin mascota) */}
            <MascotGuide
              compact
              mood="explaining"
              title="Alertin te explica"
              text="Arrastra el marcador en el mapa o toca directamente sobre el techo de tu casa para registrar su posición. Comprobaremos de inmediato si tu terreno está sobre suelo blando, laderas o zonas históricas de aluvión."
            />

            {/* Barra Selectora de Peligros y Leyenda (antes del mapa) */}
            {/* Selector Directo de Peligros en el Mapa */}
            <div className="p-3.5 bg-canvas-surface border border-border-subtle rounded-2xl shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-primary">
                  Peligros en el mapa
                </span>
                <span className="text-[11px] text-ink-muted">
                  Toca para activar o desactivar
                </span>
              </div>

              {/* Botones directos con solo el tipo de desastre natural */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => toggleThreat('alluvium_inaigem')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeThreats.has('alluvium_inaigem')
                      ? 'bg-sky-600 border-sky-600 text-white shadow-2xs'
                      : 'bg-canvas-glacial border-border-subtle text-ink-muted hover:text-ink-primary hover:bg-sky-50'
                  }`}
                >
                  <Waves size={15} />
                  <span>Aluvión</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const hasSeismic = activeThreats.has('seismic') || activeThreats.has('seismic_lima');
                    setActiveThreats((prev) => {
                      const next = new Set(prev);
                      if (hasSeismic) {
                        next.delete('seismic');
                        next.delete('seismic_lima');
                      } else {
                        next.add('seismic');
                        next.add('seismic_lima');
                      }
                      return next;
                    });
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeThreats.has('seismic') || activeThreats.has('seismic_lima')
                      ? 'bg-sky-600 border-sky-600 text-white shadow-2xs'
                      : 'bg-canvas-glacial border-border-subtle text-ink-muted hover:text-ink-primary hover:bg-sky-50'
                  }`}
                >
                  <Activity size={15} />
                  <span>Sismo</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleThreat('landslide')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeThreats.has('landslide')
                      ? 'bg-sky-600 border-sky-600 text-white shadow-2xs'
                      : 'bg-canvas-glacial border-border-subtle text-ink-muted hover:text-ink-primary hover:bg-sky-50'
                  }`}
                >
                  <Mountain size={15} />
                  <span>Deslizamiento</span>
                </button>
              </div>

              {/* Botón selector de Ruta de Escape — Solo disponible si la capa de Aluvión está activa */}
              <div className="pt-2 border-t border-border-subtle flex flex-wrap items-center justify-between gap-2">
                {isAlluviumActive ? (
                  <button
                    type="button"
                    onClick={handleToggleEscapeRoute}
                    disabled={isCalculatingRoute}
                    className={`px-3 py-1.5 min-h-[40px] text-xs font-bold rounded-xl border transition-all flex items-center gap-2 cursor-pointer shadow-2xs ${
                      showEscapeRoute
                        ? 'bg-emergency-600 border-emergency-600 text-white'
                        : 'bg-canvas-surface border-emergency-600 text-emergency-600 hover:bg-emergency-surface'
                    }`}
                  >
                    <Footprints size={15} />
                    <span>
                      {isCalculatingRoute
                        ? 'Calculando ruta de escape...'
                        : showEscapeRoute
                        ? 'Ocultar Ruta de Escape'
                        : 'Visualizar Ruta de Escape (Aluvión Huaraz)'}
                    </span>
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-canvas-surface border border-border-subtle rounded-xl text-xs text-ink-muted">
                    <Info size={14} className="text-ink-muted shrink-0" />
                    <span>Ruta de escape disponible únicamente con la capa de Aluvión activa</span>
                  </div>
                )}

                {showEscapeRoute && isAlluviumActive && escapeRoute && (
                  <span className="text-[11px] font-bold text-emergency-600 bg-emergency-surface border border-emergency-600/30 px-2.5 py-1 rounded-lg">
                    Ruta hacia: {escapeRoute.destination.nombre} (~{escapeRoute.estimatedTimeMinutes} min)
                  </span>
                )}
              </div>
            </div>

            {/* Visor de Mapa Plano con Capas Coropléticas y Ruta de Escape opcional */}
            <div className="border border-border-subtle bg-canvas-surface rounded-2xl overflow-hidden shadow-sm">
              <LeafletMap
                coordinates={coordinates}
                onChangeCoordinates={handleMapChange}
                onHazardDetected={setLocalHazard}
                externalActiveThreats={activeThreats}
                externalRoute={showEscapeRoute && isAlluviumActive ? escapeRoute : null}
                fadedHazards={showEscapeRoute && isAlluviumActive}
                height="440px"
                hideInternalControls={true}
              />
            </div>

            {/* Alertin en vivo: cambia de color (y expresión) según la peor
                severidad entre las capas activas en el punto del marcador */}
            {(() => {
              const alertin = hazardToAlertinSemaphore(localHazard);
              return (
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
                      Alertin cambia según lo que detecta bajo el marcador, considerando las capas activas.
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Ficha informativa de la Ruta de Escape cuando está activa */}
            {showEscapeRoute && isAlluviumActive && escapeRoute && (
              <div className="p-4 bg-canvas-surface border-2 border-emergency-600 rounded-2xl space-y-2.5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border-subtle pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emergency-surface text-emergency-600 flex items-center justify-center shrink-0">
                      <Footprints size={16} />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-emergency-600 block">
                        Ruta Peatonal de Evacuación
                      </span>
                      <h4 className="text-sm font-bold text-ink-primary">
                        Destino: {escapeRoute.destination.nombre} ({escapeRoute.destination.sector})
                      </h4>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emergency-600 bg-emergency-surface px-2.5 py-1 rounded-lg">
                    ~{escapeRoute.estimatedTimeMinutes} min ({escapeRoute.distanceMeters} m)
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-ink-primary">
                  <span className="block text-ink-muted leading-relaxed">
                    {escapeRoute.isInsideHazard
                      ? '⚠️ Atención: Te encuentras dentro de la zona de flujo aluvial modelada por INAIGEM. Debes evacuar inmediatamente.'
                      : '✅ Fuera del cono aluvial: Desplázate directamente hacia el refugio asignado.'}
                  </span>
                  <a
                    href={escapeRoute.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:underline"
                  >
                    <span>Abrir indicación paso a paso en GPS</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            )}

            {/* Barra de Coordenadas y Acciones */}
            <div className="p-4 bg-canvas-surface border-l-4 border-sky-600 rounded-xl border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-ink-primary shadow-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sky-600 shrink-0" />
                <span>
                  Coordenadas: <strong>{coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}</strong>
                </span>
              </div>
              <span className="text-xs text-ink-muted font-mono uppercase font-bold">
                Territorio: {cityId.toUpperCase()}
              </span>
            </div>

            {/* Botonera accesible */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button onClick={handleLocate} disabled={isLocating} variant="primary">
                {isLocating ? 'Detectando GPS...' : 'Usar mi ubicación GPS'}
              </Button>
              <Button onClick={() => handleMapChange(HUARAZ_FALLBACK_COORDS)} variant="outline">
                Centrar en Huaraz
              </Button>
              <Button onClick={() => handleMapChange(LIMA_FALLBACK_COORDS)} variant="outline">
                Centrar en Lima
              </Button>
            </div>

            {/* Botón de Continuar */}
            <div className="pt-4 border-t border-border-subtle">
              <Button
                onClick={handleProceedToForm}
                disabled={isAnalyzingSpatial}
                size="lg"
                fullWidth
                variant="primary"
              >
                <span>{isAnalyzingSpatial ? 'Analizando peligros territoriales...' : 'Continuar al Cuestionario de la Vivienda'}</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------------
            PASO 2: CUESTIONARIO ESTRUCTURAL (6 PREGUNTAS HUMANIZADAS RNE)
            ------------------------------------------------------------------ */}
        {isAuthenticated && step === 'assessment' && (
          <section className="space-y-6">
            <div className="border-b border-border-subtle pb-4">
              <span className="text-xs uppercase tracking-widest text-sky-700 font-bold">
                Paso 2 de 3
              </span>
              <h1 className="font-display text-2xl font-black text-ink-primary mt-1">
                Evaluación de tu Casa
              </h1>
              <p className="text-ink-muted text-sm mt-2 leading-relaxed">
                Responde estas 6 preguntas sencillas sobre los materiales, columnas y pisos de tu casa. Basado en las normas oficiales del Reglamento Nacional de Edificaciones (RNE).
              </p>
            </div>

            <HousingForm
              answers={answers}
              cityId={cityId}
              onAnswersChange={setAnswers}
              onResetAnswers={handleResetAnswers}
            />

            <div className="pt-4 border-t border-border-subtle flex flex-col sm:flex-row gap-3">
              <Button onClick={() => setStep('location')} variant="outline">
                ← Volver al Mapa
              </Button>
              <Button onClick={handleCalculateResults} size="lg" variant="primary" className="flex-1">
                <span>Obtener Dictamen y Plan de Emergencia</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------------
            PASO 3: REPORTE DE RESULTADOS Y PLAN DE EMERGENCIA
            ------------------------------------------------------------------ */}
        {isAuthenticated && step === 'results' && (
          <section className="space-y-12">
            <div className="border-b border-border-subtle pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-sky-700 font-bold">
                  Paso 3 de 3 · Dictamen Final
                </span>
                <h1 className="font-display text-2xl font-black text-ink-primary mt-1">
                  Reporte de Vulnerabilidad y Riesgo
                </h1>
                <p className="text-ink-muted text-xs mt-1">
                  Evaluación técnica oficial respaldada por normas del RNE y CENEPRED.
                  {savedEvalId && ` (ID de registro: ${savedEvalId.slice(0, 8)})`}
                </p>
              </div>

              <Button onClick={handleRestart} variant="outline" size="md">
                <RotateCcw className="w-4 h-4 mr-2" />
                Nueva Evaluación
              </Button>
            </div>

            {/* Dictamen Estructural de Riesgo (Semáforo Limpio según Mockup Vista 5) */}
            <CleanAssessmentResult
              result={multiHazardRisk}
              evaluacionId={savedEvalId || undefined}
              coordinates={coordinates}
            />
          </section>
        )}

        {/* ------------------------------------------------------------------
            PANTALLA DE CARGA 1: ANÁLISIS DE PELIGRO TERRITORIAL Y ESPACIAL
            ------------------------------------------------------------------ */}
        <AnalysisLoadingOverlay
          isOpen={isAnalyzingSpatial}
          title="Analizando Peligros Territoriales en Tiempo Real"
          subtitle="Cruzando tu ubicación exacta con la cartografía oficial del CISMID, INAIGEM y CENEPRED."
          steps={SPATIAL_ANALYSIS_STEPS}
          onComplete={handleSpatialAnalysisComplete}
          minDurationMs={2100}
        />

        {/* ------------------------------------------------------------------
            PANTALLA DE CARGA 2: CÁLCULO DE VULNERABILIDAD Y RIESGO MULTIAMENAZA
            ------------------------------------------------------------------ */}
        <AnalysisLoadingOverlay
          isOpen={isCalculatingRisk}
          title="Calculando Vulnerabilidad Estructural y Riesgo"
          subtitle="Aplicando la matriz de Saaty (AHP) y las normas técnicas del Reglamento Nacional de Edificaciones."
          steps={RISK_CALCULATION_STEPS}
          onComplete={handleRiskCalculationComplete}
          minDurationMs={2000}
        />
      </main>
    </div>
  );
};

