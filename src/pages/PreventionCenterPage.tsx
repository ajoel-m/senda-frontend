import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Home,
  Map,
  AlertTriangle,
  Waves,
  Mountain,
  CheckCircle2,
  ChevronRight,
  Crosshair,
  Backpack,
  FileText,
  Shield,
  Zap,
  Flame,
  Phone,
  XCircle,
  Footprints,
  Box,
  ChevronDown,
} from 'lucide-react';
import { OFFICIAL_RECOMMENDATIONS } from '../data/recommendations';
import { LeafletMap } from '../components/map/LeafletMap';
import { Coordinates } from '../context/EvaluationContext';
import { MountainBackdrop } from '../components/brand/MountainBackdrop';
import { HazardType, IntersectingHazardResult } from '../services/gisLayers';
import { hazardToAlertinSemaphore } from '../lib/alertin';
import { EmergencyKitView } from '../components/results/EmergencyKitView';
import { LeadCaptureForm } from '../components/forms/LeadCaptureForm';
import { MascotGuide } from '../components/MascotGuide';

export const PreventionCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<
    'menu' | 'quick-tips' | 'risk-map' | 'mochila' | 'asesoria'
  >('menu');
  const [activeHazard, setActiveHazard] = useState<'sismo' | 'aluvion' | 'deslizamiento'>('sismo');
  const [activePhase, setActivePhase] = useState<'todos' | 'antes' | 'durante' | 'despues'>('todos');
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({});

  const toggleCard = (id: string) => {
    setExpandedCardIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Coordenadas de exploración del mapa (por defecto Huaraz)
  const [mapCoords, setMapCoords] = useState<Coordinates>({ lat: -9.528, lng: -77.528 });

  // Estado multicapa: permite activar varias capas a la vez
  const [activeThreats, setActiveThreats] = useState<Set<HazardType>>(
    new Set<HazardType>(['alluvium_inaigem', 'seismic', 'seismic_lima'])
  );
  const [localHazard, setLocalHazard] = useState<IntersectingHazardResult | null>(null);

  const toggleLayer = (layer: HazardType) => {
    const updated = new Set(activeThreats);
    if (updated.has(layer)) {
      updated.delete(layer);
    } else {
      updated.add(layer);
    }
    setActiveThreats(updated);
  };

  const toggleSeismicGroup = () => {
    const hasSeismic = activeThreats.has('seismic') || activeThreats.has('seismic_lima');
    const updated = new Set(activeThreats);
    if (hasSeismic) {
      updated.delete('seismic');
      updated.delete('seismic_lima');
    } else {
      updated.add('seismic');
      updated.add('seismic_lima');
    }
    setActiveThreats(updated);
  };

  const handleGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMapCoords({
            lat: Number(pos.coords.latitude.toFixed(6)),
            lng: Number(pos.coords.longitude.toFixed(6)),
          });
        },
        () => {
          console.warn('GPS no disponible, manteniendo coordenadas previas.');
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  };

  const filteredRecommendations = OFFICIAL_RECOMMENDATIONS.filter(
    (r) => r.hazard === activeHazard && (activePhase === 'todos' || r.phase === activePhase)
  );

  const renderRecommendationIcon = (iconType: string) => {
    switch (iconType) {
      case 'shield':
        return <Shield size={18} className="text-sky-600 shrink-0" />;
      case 'alert':
        return <AlertTriangle size={18} className="text-amber-600 shrink-0" />;
      case 'flame':
        return <Flame size={18} className="text-emergency-600 shrink-0" />;
      case 'zap':
        return <Zap size={18} className="text-amber-500 shrink-0" />;
      case 'phone':
        return <Phone size={18} className="text-emerald-600 shrink-0" />;
      case 'water':
        return <Waves size={18} className="text-cyan-600 shrink-0" />;
      case 'footsteps':
        return <Footprints size={18} className="text-indigo-600 shrink-0" />;
      case 'box':
        return <Box size={18} className="text-sky-600 shrink-0" />;
      case 'home':
      default:
        return <Home size={18} className="text-sky-600 shrink-0" />;
    }
  };

  const getPhaseBadge = (phase: 'antes' | 'durante' | 'despues') => {
    switch (phase) {
      case 'antes':
        return { label: 'Antes', color: 'bg-sky-50 text-sky-700 border-sky-200' };
      case 'durante':
        return { label: 'Durante', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'despues':
        return { label: 'Después', color: 'bg-purple-50 text-purple-800 border-purple-200' };
    }
  };

  const isSeismicActive = activeThreats.has('seismic') || activeThreats.has('seismic_lima');
  const isAlluviumActive = activeThreats.has('alluvium_inaigem');
  const isLandslideActive = activeThreats.has('landslide');

  return (
    <div className="w-full min-h-[calc(100vh-130px)] bg-transparent text-ink-primary pb-24 pt-4 px-4 sm:px-6 relative">
      <MountainBackdrop />
      <main className="max-w-2xl mx-auto space-y-6 relative z-10">
        {/* Cabecera del Centro de Prevención */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <button
            type="button"
            onClick={() => {
              if (selectedSection !== 'menu') {
                setSelectedSection('menu');
              } else {
                navigate('/app');
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-ink-primary"
          >
            <ArrowLeft size={16} />
            <span>{selectedSection !== 'menu' ? 'Menú de Prevención' : 'Inicio'}</span>
          </button>

          <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-border-subtle px-2.5 py-1 rounded-full">
            Prevención Cívica
          </span>
        </div>

        {/* -------------------------------------------------------------
            VISTA 1: MENÚ DE 3 OPCIONES CON ÍCONOS GRANDES (MOCKUP VISTA 4)
            ------------------------------------------------------------- */}
        {selectedSection === 'menu' && (
          <div className="space-y-4 max-w-md mx-auto">
            <div className="text-center space-y-1">
              <h1 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-ink-primary">
                CENTRO DE PREVENCIÓN
              </h1>
              <p className="text-xs text-ink-muted">
                Elige qué deseas consultar para proteger a tu familia.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* Opción 1: Recomendaciones Rápidas */}
              <button
                type="button"
                onClick={() => setSelectedSection('quick-tips')}
                className="w-full text-left p-4 rounded-2xl bg-senda-cielo hover:bg-senda-cielo/90 text-ink-primary shadow-sm flex items-center justify-between transition-transform active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-white/40 flex items-center justify-center shrink-0">
                    <BookOpen size={24} className="text-ink-primary" />
                  </div>
                  <div>
                    <span className="text-base font-bold block">
                      Recomendaciones Rápidas
                    </span>
                    <span className="text-xs text-ink-primary/70 block">
                      Consejos directos ante sismos y aluviones
                    </span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-ink-primary/70" />
              </button>

              {/* Opción 2: Evalúa tu Casa */}
              <button
                type="button"
                onClick={() => navigate('/evaluar')}
                className="w-full text-left p-4 rounded-2xl bg-senda-ruta hover:bg-senda-ruta/90 text-ink-primary shadow-sm flex items-center justify-between transition-transform active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center shrink-0">
                    <Home size={24} className="text-ink-primary" />
                  </div>
                  <div>
                    <span className="text-base font-bold block">
                      Evalúa tu Casa
                    </span>
                    <span className="text-xs text-ink-primary/70 block">
                      Test de 6 preguntas sencillas sin tecnicismos
                    </span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-ink-primary/70" />
              </button>

              {/* Opción 3: Visor de Peligros */}
              <button
                type="button"
                onClick={() => setSelectedSection('risk-map')}
                className="w-full text-left p-4 rounded-2xl bg-ink-primary hover:bg-ink-primary/90 text-white shadow-sm flex items-center justify-between transition-transform active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Map size={24} className="text-white" />
                  </div>
                  <div>
                    <span className="text-base font-bold block">
                      Visor de Peligros
                    </span>
                    <span className="text-xs text-sky-100 block">
                      Explora y combina mapas de peligro oficiales
                    </span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-white/80" />
              </button>

              {/* Opción 4: Checklist de Mochila de Emergencia (directo, sin evaluar la casa primero) */}
              <button
                type="button"
                onClick={() => setSelectedSection('mochila')}
                className="w-full text-left p-4 rounded-2xl bg-dawn-amber hover:bg-dawn-amber/90 text-ink-primary shadow-sm flex items-center justify-between transition-transform active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center shrink-0">
                    <Backpack size={24} className="text-ink-primary" />
                  </div>
                  <div>
                    <span className="text-base font-bold block">
                      Checklist de Mochila de Emergencia
                    </span>
                    <span className="text-xs text-ink-primary/70 block">
                      Directo, sin evaluar tu casa primero
                    </span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-ink-primary/70" />
              </button>

              {/* Opción 5: Recibir Asesoría Oficial */}
              <button
                type="button"
                onClick={() => setSelectedSection('asesoria')}
                className="w-full text-left p-4 rounded-2xl bg-senda-coral hover:bg-senda-coral/90 text-white shadow-sm flex items-center justify-between transition-transform active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                    <FileText size={24} className="text-white" />
                  </div>
                  <div>
                    <span className="text-base font-bold block">
                      Recibir Asesoría Oficial
                    </span>
                    <span className="text-xs text-white/70 block">
                      Informe técnico e inspección de un ingeniero
                    </span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-white/70" />
              </button>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            VISTA 2: RECOMENDACIONES RÁPIDAS (CON SELECTOR DE AMENAZA)
            ------------------------------------------------------------- */}
        {selectedSection === 'quick-tips' && (
          <div className="space-y-4 max-w-md mx-auto">
            <div>
              <h2 className="text-lg font-bold text-ink-primary">
                Recomendaciones Rápidas
              </h2>
              <p className="text-xs text-ink-muted">
                Selecciona la amenaza para conocer las pautas oficiales del INDECI y RNE.
              </p>
            </div>

            {/* Selector de Amenaza (Botones Accesibles - No se altera el selector) */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setActiveHazard('sismo')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-colors flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  activeHazard === 'sismo'
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-canvas-surface text-ink-primary border-border-subtle hover:bg-canvas-glacial'
                }`}
              >
                <AlertTriangle size={16} />
                <span>Sismos</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveHazard('aluvion')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-colors flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  activeHazard === 'aluvion'
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-canvas-surface text-ink-primary border-border-subtle hover:bg-canvas-glacial'
                }`}
              >
                <Waves size={16} />
                <span>Aluvión</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveHazard('deslizamiento')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-colors flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  activeHazard === 'deslizamiento'
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-canvas-surface text-ink-primary border-border-subtle hover:bg-canvas-glacial'
                }`}
              >
                <Mountain size={16} />
                <span>Laderas</span>
              </button>
            </div>

            {/* Segmentación Temporal Oficial: Antes / Durante / Después */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-ink-muted uppercase tracking-wider">
                <span>Momento de Aplicación:</span>
                <span className="font-mono text-sky-700">{filteredRecommendations.length} pautas</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-canvas-surface border border-border-subtle rounded-xl">
                {(['todos', 'antes', 'durante', 'despues'] as const).map((phaseKey) => {
                  const labelMap = {
                    todos: 'Todas',
                    antes: 'Antes',
                    durante: 'Durante',
                    despues: 'Después',
                  };
                  const isSelected = activePhase === phaseKey;
                  return (
                    <button
                      key={phaseKey}
                      type="button"
                      onClick={() => setActivePhase(phaseKey)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                        isSelected
                          ? 'bg-ink-primary text-white shadow-xs'
                          : 'text-ink-muted hover:text-ink-primary hover:bg-canvas-glacial'
                      }`}
                    >
                      {labelMap[phaseKey]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Listado de Tarjetas Didácticas Estilo Senda con Cero Emojis */}
            <div className="space-y-3 pt-1">
              {filteredRecommendations.length === 0 ? (
                <div className="p-6 text-center bg-canvas-surface border border-border-subtle rounded-2xl space-y-2">
                  <Shield size={24} className="mx-auto text-ink-muted" />
                  <p className="text-xs text-ink-muted">
                    No hay pautas específicas registradas para esta fase temporal.
                  </p>
                </div>
              ) : (
                filteredRecommendations.map((item) => {
                  const phaseInfo = getPhaseBadge(item.phase);
                  const isExpanded = !!expandedCardIds[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCard(item.id)}
                      className="bg-canvas-surface border border-border-subtle rounded-2xl p-4 space-y-3 shadow-xs hover:border-sky-300 transition-all cursor-pointer select-none group"
                    >
                      {/* Cabecera con Categoría, Fase e Icono Oficial */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 group-hover:bg-sky-100/70 transition-colors">
                            {renderRecommendationIcon(item.iconType)}
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-mono font-bold uppercase text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
                              {item.category}
                            </span>
                            <span
                              className={`text-[10px] font-bold border px-2 py-0.5 rounded-md ${phaseInfo.color}`}
                            >
                              {phaseInfo.label}
                            </span>
                          </div>
                        </div>

                        {item.badgeText && (
                          <span className="text-[10px] font-bold text-emergency-700 bg-emergency-50 border border-emergency-200 px-2 py-0.5 rounded-full">
                            {item.badgeText}
                          </span>
                        )}
                      </div>

                      {/* Título e Instrucción Directa y Concreta (Visible siempre) */}
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-ink-primary leading-snug group-hover:text-sky-700 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-ink-primary/90 leading-relaxed font-medium">
                          {item.shortInstruction}
                        </p>
                      </div>

                      {/* Alerta de Acción Prohibida (Peligro Inminente - Siempre visible) */}
                      {item.prohibitedAction && (
                        <div className="p-2.5 bg-emergency-50/70 border border-emergency-200/80 rounded-xl flex items-start gap-2 text-emergency-800 text-[11px] leading-tight">
                          <XCircle size={15} className="text-emergency-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="font-bold">PROHIBIDO: </strong>
                            <span>{item.prohibitedAction}</span>
                          </div>
                        </div>
                      )}

                      {/* Información Completa Desplegable */}
                      {isExpanded && (
                        <div className="space-y-3 pt-2 border-t border-border-subtle animate-in fade-in duration-200">
                          <div className="space-y-1.5">
                            {item.details.map((detail, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 text-[11px] text-ink-muted leading-relaxed"
                              >
                                <CheckCircle2 size={13} className="text-sky-600 shrink-0 mt-0.5" />
                                <span>{detail}</span>
                              </div>
                            ))}
                          </div>

                          {/* Sustento Oficial de la Norma */}
                          <div className="pt-1 flex items-center justify-between text-[10px] text-ink-muted border-t border-border-subtle/50 font-mono">
                            <span>Fuente: {item.normativeRef}</span>
                          </div>
                        </div>
                      )}

                      {/* Indicador de Expansión / Clic */}
                      <div className="pt-1 flex items-center justify-between text-[11px] font-semibold text-sky-700">
                        <span>{isExpanded ? 'Ocultar detalles' : 'Toca para ver información completa'}</span>
                        <ChevronDown
                          size={15}
                          className={`transition-transform duration-200 text-sky-600 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            VISTA 3: VISOR DE PELIGROS OFICIALES CON SELECTOR MULTICAPA
            ------------------------------------------------------------- */}
        {selectedSection === 'risk-map' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-ink-primary">
                Visor de Peligros Oficiales
              </h2>
              <p className="text-xs text-ink-muted">
                Activa o desactiva las capas que deseas consultar en el mapa. Puedes combinar varias capas a la vez para evaluar amenazas superpuestas.
              </p>
            </div>

            <MascotGuide
              compact
              mood="exploring"
              text="Prende o apaga las capas de abajo para ver cada peligro por separado, o combínalas para ver dónde se superponen."
            />

            {/* Selector de Ciudad y Botón GPS */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-canvas-surface border border-border-subtle rounded-xl">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-ink-muted px-1">Centrar en:</span>
                <button
                  type="button"
                  onClick={() => setMapCoords({ lat: -9.528, lng: -77.528 })}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    Math.abs(mapCoords.lat - -9.528) < 0.1
                      ? 'bg-sky-600 text-white'
                      : 'bg-canvas-glacial text-ink-primary hover:bg-sky-50'
                  }`}
                >
                  Huaraz
                </button>
                <button
                  type="button"
                  onClick={() => setMapCoords({ lat: -12.046, lng: -77.030 })}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    Math.abs(mapCoords.lat - -12.046) < 0.1
                      ? 'bg-sky-600 text-white'
                      : 'bg-canvas-glacial text-ink-primary hover:bg-sky-50'
                  }`}
                >
                  Lima
                </button>
              </div>

              <button
                type="button"
                onClick={handleGPS}
                className="px-2.5 py-1 text-xs font-bold text-sky-700 hover:bg-sky-50 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                title="Detectar mi ubicación actual por GPS"
              >
                <Crosshair size={14} />
                <span>Mi GPS</span>
              </button>
            </div>

            {/* SELECTOR DIRECTO DE PELIGROS */}
            <div className="bg-canvas-surface border border-border-subtle rounded-2xl p-3 shadow-xs space-y-2.5">
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
                  onClick={() => toggleLayer('alluvium_inaigem')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isAlluviumActive
                      ? 'bg-sky-600 border-sky-600 text-white shadow-2xs'
                      : 'bg-canvas-glacial border-border-subtle text-ink-muted hover:text-ink-primary hover:bg-sky-50'
                  }`}
                >
                  <Waves size={15} />
                  <span>Aluvión</span>
                </button>

                <button
                  type="button"
                  onClick={toggleSeismicGroup}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSeismicActive
                      ? 'bg-sky-600 border-sky-600 text-white shadow-2xs'
                      : 'bg-canvas-glacial border-border-subtle text-ink-muted hover:text-ink-primary hover:bg-sky-50'
                  }`}
                >
                  <AlertTriangle size={15} />
                  <span>Sismo</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleLayer('landslide')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isLandslideActive
                      ? 'bg-sky-600 border-sky-600 text-white shadow-2xs'
                      : 'bg-canvas-glacial border-border-subtle text-ink-muted hover:text-ink-primary hover:bg-sky-50'
                  }`}
                >
                  <Mountain size={15} />
                  <span>Deslizamiento</span>
                </button>
              </div>
            </div>

            {/* VISOR DE MAPA LEAFLET */}
            <div className="bg-canvas-surface border border-border-subtle rounded-2xl overflow-hidden shadow-sm">
              <LeafletMap
                coordinates={mapCoords}
                onChangeCoordinates={setMapCoords}
                onHazardDetected={setLocalHazard}
                height="400px"
                cleanMode={false}
                externalActiveThreats={activeThreats}
                hideInternalControls={true}
                hidePanicButton={true}
                showBottomAlert={true}
              />
            </div>

            {/* Alertin en vivo: cambia de color y expresión según la peor
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

            {/* LEYENDA CARTOGRÁFICA OFICIAL */}
            <div className="bg-canvas-surface border border-border-subtle rounded-2xl p-3.5 space-y-2.5 shadow-xs">
              <span className="text-xs font-bold text-ink-primary block">
                Niveles de Peligro en el Mapa
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-emergency-surface border border-emergency-600/30">
                  <div className="w-3.5 h-3.5 rounded-full bg-emergency-600 shrink-0" />
                  <div>
                    <span className="font-bold text-emergency-600 block text-[11px]">Muy Alto</span>
                    <span className="text-[10px] text-emergency-700 leading-tight block">Faja de flujo / Suelo blando</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-dawn-amberSurface border border-dawn-amber/30">
                  <div className="w-3.5 h-3.5 rounded-full bg-dawn-amber shrink-0" />
                  <div>
                    <span className="font-bold text-dawn-amber block text-[11px]">Alto</span>
                    <span className="text-[10px] text-dawn-amber/90 leading-tight block">Zona de desborde</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-dawn-amberSurface border border-dawn-amber/40">
                  <div className="w-3.5 h-3.5 rounded-full bg-dawn-amberSurface0 shrink-0" />
                  <div>
                    <span className="font-bold text-[#B36A16] block text-[11px]">Medio</span>
                    <span className="text-[10px] text-[#B36A16] leading-tight block">Afectación marginal</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-life-50 border border-life-500/30">
                  <div className="w-3.5 h-3.5 rounded-full bg-life-600 shrink-0" />
                  <div>
                    <span className="font-bold text-life-600 block text-[11px]">Seguro</span>
                    <span className="text-[10px] text-life-600/90 leading-tight block">Refugio / Ladera alta</span>
                  </div>
                </div>
              </div>
            </div>

            {/* LLAMADO A LA ACCIÓN (EVALUAR VIVIENDA) */}
            <div className="bg-canvas-surface border border-border-subtle rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-0.5 text-center sm:text-left">
                <span className="text-xs font-black uppercase text-ink-primary block">
                  ¿Quieres saber si tu casa resistirá?
                </span>
                <span className="text-xs text-ink-muted block">
                  Responde 6 preguntas sencillas sobre tus paredes, columnas y pisos.
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/evaluar')}
                className="w-full sm:w-auto px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
              >
                Evaluar mi casa ahora
              </button>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            VISTA 4: MOCHILA DE EMERGENCIA (ACCESO DIRECTO)
            ------------------------------------------------------------- */}
        {selectedSection === 'mochila' && (
          <div className="space-y-4 max-w-md mx-auto">
            <div>
              <h2 className="text-lg font-bold text-ink-primary">
                Mochila de Emergencia
              </h2>
              <p className="text-xs text-ink-muted">
                Lista oficial INDECI, aunque todavía no hayas evaluado tu vivienda.
              </p>
            </div>
            <EmergencyKitView />
          </div>
        )}

        {/* -------------------------------------------------------------
            VISTA 5: ASESORÍA OFICIAL (ACCESO DIRECTO)
            ------------------------------------------------------------- */}
        {selectedSection === 'asesoria' && (
          <div className="space-y-4 max-w-md mx-auto">
            <div>
              <h2 className="text-lg font-bold text-ink-primary">
                Asesoría Oficial
              </h2>
              <p className="text-xs text-ink-muted">
                Solicita el informe técnico o una inspección de un ingeniero, sin necesidad de completar la evaluación primero.
              </p>
            </div>
            <LeadCaptureForm />
          </div>
        )}
      </main>
    </div>
  );
};
