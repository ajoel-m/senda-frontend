import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  Compass,
  FileCheck2,
  AlertTriangle,
  HeartHandshake,
  CheckCircle2,
  BookOpen,
  MapPin,
  ChevronRight,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';


export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();

  const handleStartEvaluation = () => {
    if (!isAuthenticated) {
      openAuthModal('/evaluar');
    } else {
      navigate('/evaluar');
    }
  };

  return (
    <div className="w-full bg-transparent text-ink-primary min-h-screen">
      {/* ------------------------------------------------------------------
          1. HERO PRINCIPAL — SENDA
          ------------------------------------------------------------------ */}
      <section className="relative w-full border-b border-border-subtle bg-canvas-surface overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Columna Izquierda: Información y Acciones */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Tag cívico */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sky-50 border border-sky-200 rounded-full text-xs font-semibold text-sky-700 shadow-2xs">
                <Compass size={15} className="text-sky-600" />
                <span>Iniciativa Cívica de Protección · Huaraz y Lima Metropolitana</span>
              </div>

              {/* Título Principal */}
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-ink-primary leading-tight tracking-tight">
                Información directa y oficial para salvar vidas ante desastres naturales
              </h1>

              {/* Bajada accesible */}
              <p className="text-base sm:text-lg text-ink-muted leading-relaxed font-normal">
                En una emergencia no hay tiempo que perder descifrando mapas complejos ni tecnicismos confusos.
                <strong> Senda</strong> brinda acceso inmediato a la ruta de evacuación peatonal más corta ante aluvión y
                a un diagnóstico en semáforo de riesgo para proteger su vivienda ante sismos.
              </p>

              {/* Botones de Acción Primarios */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={handleStartEvaluation}
                  className="px-6 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 min-h-[48px] text-base cursor-pointer active:scale-98"
                >
                  <span>Evaluar mi vivienda</span>
                  <ArrowRight size={18} />
                </button>

                <Link to="/panico">
                  <button
                    type="button"
                    className="w-full sm:w-auto px-5 py-3.5 bg-emergency-600 hover:bg-emergency-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 min-h-[48px] text-sm cursor-pointer active:scale-98"
                    title="Acceso directo a la ruta de escape ante aluvión en Huaraz"
                  >
                    <AlertTriangle size={18} />
                    <span>Botón de Pánico (Aluvión Huaraz)</span>
                  </button>
                </Link>

                <Link to="/prevencion">
                  <button
                    type="button"
                    className="w-full sm:w-auto px-5 py-3.5 bg-canvas-glacial hover:bg-sky-50 text-ink-primary font-bold border border-border-subtle rounded-xl transition-all flex items-center justify-center gap-2 min-h-[48px] text-sm cursor-pointer"
                  >
                    <Shield size={17} className="text-sky-600" />
                    <span>Centro de Prevención</span>
                  </button>
                </Link>
              </div>

              {/* Listado limpio de respaldo oficial */}
              <div className="pt-5 border-t border-border-subtle flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-xs text-ink-muted">
                <span className="font-semibold text-ink-primary">Fuentes oficiales del Estado:</span>
                <span className="font-semibold text-sky-700">INAIGEM</span>
                <span className="text-border-subtle">·</span>
                <span className="font-semibold text-sky-700">IGP</span>
                <span className="text-border-subtle">·</span>
                <span className="font-semibold text-sky-700">INDECI</span>
                <span className="text-border-subtle">·</span>
                <span className="font-semibold text-sky-700">CENEPRED</span>
                <span className="text-border-subtle">·</span>
                <span className="inline-flex items-center gap-1 font-semibold text-life-600">
                  <CheckCircle2 size={14} />
                  Normas RNE E.030, E.070 y E.080
                </span>
              </div>
            </div>

            {/* Columna Derecha: Ilustración Complementaria Senda */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md lg:max-w-none rounded-3xl overflow-hidden border border-border-subtle shadow-md bg-canvas-glacial group">
                <img
                  src="/assets/info-hero-landscape.jpg"
                  alt="Ilustración del valle andino con casas protegidas y la ruta segura de Senda"
                  className="w-full h-auto object-cover aspect-[4/3] transform transition-transform duration-500 group-hover:scale-102"
                  loading="eager"
                />
                {/* Badge flotante con Alertin */}
                <div className="absolute bottom-3 left-3 right-3 p-2.5 bg-canvas-surface/90 backdrop-blur-md rounded-2xl border border-border-subtle/80 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src="/mascots/alertin_principal.svg"
                      alt="Alertin"
                      className="w-7 h-7 drop-shadow-xs shrink-0"
                    />
                    <div className="text-left truncate">
                      <span className="text-xs font-black text-ink-primary block leading-tight truncate">
                        Ruta Segura y Prevención
                      </span>
                      <span className="text-[10px] text-ink-muted block truncate">
                        Huaraz y Lima Metropolitana
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 shrink-0 ml-2">
                    Oficial
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          2. COBERTURA TERRITORIAL Y DISPONIBILIDAD
          ------------------------------------------------------------------ */}
      <section className="py-14 px-4 sm:px-6 border-b border-border-subtle bg-sky-50/70 dark:bg-canvas-surface/80">
        <div className="max-w-5xl mx-auto space-y-10">


          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              Disponibilidad Territorial
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink-primary">
              Cobertura actual y tipos de desastres atendidos
            </h2>
            <p className="text-sm text-ink-muted">
              La plataforma opera en función de la cartografía oficial y los refugios delimitados por las autoridades competentes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Huaraz */}
            <div className="p-6 bg-canvas-surface border border-border-subtle rounded-2xl space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <div className="flex items-center gap-2">
                  <MapPin size={20} className="text-emergency-600" />
                  <h3 className="text-lg font-bold text-ink-primary">Huaraz e Independencia (Áncash)</h3>
                </div>
                <span className="text-[11px] font-bold text-emergency-600 bg-emergency-50 border border-emergency-200 px-2.5 py-1 rounded-full uppercase">
                  Multiamenaza
                </span>
              </div>
              <ul className="space-y-2.5 text-xs text-ink-muted">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-life-600 shrink-0 mt-0.5" />
                  <span><strong className="text-ink-primary">Peligros integrados:</strong> Aluviones (fajas de flujo modeladas por INAIGEM), deslizamientos y sismos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-life-600 shrink-0 mt-0.5" />
                  <span><strong className="text-ink-primary">Botón de Pánico habilitado:</strong> Exclusivo para Aluvión del río Quillcay hacia refugios oficiales.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-life-600 shrink-0 mt-0.5" />
                  <span><strong className="text-ink-primary">Prevención:</strong> Autodiagnóstico estructural y plan de contingencia ante aluviones.</span>
                </li>
              </ul>
            </div>

            {/* Lima */}
            <div className="p-6 bg-canvas-surface border border-border-subtle rounded-2xl space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <div className="flex items-center gap-2">
                  <MapPin size={20} className="text-sky-600" />
                  <h3 className="text-lg font-bold text-ink-primary">Lima Metropolitana</h3>
                </div>
                <span className="text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-full uppercase">
                  Peligro Sísmico
                </span>
              </div>
              <ul className="space-y-2.5 text-xs text-ink-muted">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-life-600 shrink-0 mt-0.5" />
                  <span><strong className="text-ink-primary">Peligro integrado:</strong> Microzonificación sísmica oficial (CISMID / FIC-UNI y RNE E.030).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-life-600 shrink-0 mt-0.5" />
                  <span><strong className="text-ink-primary">Prevención:</strong> Diagnóstico de muros (concreto, King Kong, pandereta) y semáforo de riesgo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Info size={15} className="text-ink-muted shrink-0 mt-0.5" />
                  <span><strong className="text-ink-primary">Nota sobre Botón de Pánico:</strong> No disponible para sismos en Lima al no existir una red oficial digitalizada de refugios peatonales.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          3. DOS ENFOQUES
          ------------------------------------------------------------------ */}
      <section className="py-16 px-4 sm:px-6 border-b border-border-subtle bg-canvas-surface">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              Dos Vías de Acción
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink-primary">
              Prepararse con anticipación y actuar en el momento crítico
            </h2>
            <p className="text-sm text-ink-muted">
              Prevenir protege el patrimonio familiar; saber hacia dónde evacuar salva la vida.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pilar 1: Botón de Pánico */}
            <div className="p-7 bg-canvas-glacial border-2 border-emergency-600 rounded-2xl space-y-5 flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emergency-50 text-emergency-600 flex items-center justify-center font-bold">
                  <AlertTriangle size={24} />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold uppercase text-emergency-600 block">
                    Actuación en la Emergencia
                  </span>
                  <h3 className="text-xl font-bold text-ink-primary">
                    Botón de Pánico (Aluvión Huaraz)
                  </h3>
                </div>
                <p className="text-sm text-ink-muted leading-relaxed">
                  Ante la alerta de aluvión, active el botón con una pulsación de 0.5 segundos.
                  El sistema detecta su posición GPS y traza la ruta peatonal más corta:
                  primero hacia terreno alto fuera de la faja de peligro, y luego hacia la zona segura o refugio oficial más cercano.
                </p>
              </div>
              <div className="pt-2">
                <Link to="/panico">
                  <button
                    type="button"
                    className="w-full py-3 bg-emergency-600 hover:bg-emergency-700 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[44px]"
                  >
                    <span>Conocer el modo de escape</span>
                    <ChevronRight size={16} />
                  </button>
                </Link>
              </div>
            </div>

            {/* Pilar 2: Prevención */}
            <div className="p-7 bg-canvas-glacial border border-border-subtle rounded-2xl space-y-5 flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  <Shield size={24} />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold uppercase text-sky-700 block">
                    Preparación Previa
                  </span>
                  <h3 className="text-xl font-bold text-ink-primary">
                    Centro de Prevención y Semáforo
                  </h3>
                </div>
                <p className="text-sm text-ink-muted leading-relaxed">
                  Acceda a recomendaciones rápidas por peligro, explore el mapa multicapa con datos de INAIGEM y CENEPRED, o evalúe su vivienda respondiendo 6 preguntas sencillas sin tecnicismos para obtener su nivel de riesgo en semáforo.
                </p>
              </div>
              <div className="pt-2">
                <Link to="/prevencion">
                  <button
                    type="button"
                    className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[44px]"
                  >
                    <span>Ir al Centro de Prevención</span>
                    <ArrowRight size={16} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          4. CÓMO FUNCIONA
          ------------------------------------------------------------------ */}
      <section className="py-16 px-4 sm:px-6 border-b border-border-subtle bg-sky-100/60 dark:bg-canvas-surface/80">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              Diagnóstico Simplificado
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink-primary">
              ¿Cómo funciona la evaluación de vivienda?
            </h2>
            <p className="text-sm text-ink-muted">
              Traducimos la complejidad ingenieril a un semáforo claro y medidas de acción directa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Paso 1 */}
            <div className="p-6 bg-canvas-surface border border-border-subtle rounded-2xl space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 bg-sky-50 text-sky-700 rounded-lg">
                  Paso 01
                </span>
                <MapPin size={20} className="text-sky-600" />
              </div>
              <h3 className="text-lg font-bold text-ink-primary">
                Ubique su lote en el mapa
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Marque su ubicación o use el GPS asistido. El sistema cruza su posición con las fajas de aluvión de INAIGEM y la zonificación sísmica. Si la capa de aluvión está activa, puede visualizar de inmediato su ruta de escape hacia el refugio más cercano.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="p-6 bg-canvas-surface border border-border-subtle rounded-2xl space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 bg-sky-50 text-sky-700 rounded-lg">
                  Paso 02
                </span>
                <FileCheck2 size={20} className="text-sky-600" />
              </div>
              <h3 className="text-lg font-bold text-ink-primary">
                Responda sobre sus muros
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                6 preguntas sencillas empleando términos de nuestro medio: si usó adobe tradicional, ladrillo King Kong o ladrillo pandereta, si tiene columnas confinadas y cuántos pisos soporta su estructura.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="p-6 bg-canvas-surface border border-border-subtle rounded-2xl space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 bg-life-50 text-life-600 rounded-lg">
                  Paso 03
                </span>
                <Shield size={20} className="text-life-600" />
              </div>
              <h3 className="text-lg font-bold text-ink-primary">
                Obtenga su semáforo de riesgo
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Reciba un resultado claro: <strong className="text-life-600">VERDE (Bajo)</strong>, <strong className="text-[#B36A16]">AMARILLO (Medio)</strong> o <strong className="text-emergency-600">ROJO (Alto)</strong>, con las 3 medidas de refuerzo prioritarias y la mochila de emergencia requerida.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleStartEvaluation}
              className="px-8 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-xs transition-all inline-flex items-center gap-2 text-base cursor-pointer min-h-[48px] active:scale-98"
            >
              <span>Comenzar evaluación de vivienda</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          5. SUSTENTO OFICIAL
          ------------------------------------------------------------------ */}
      <section className="py-14 px-4 sm:px-6 bg-canvas-surface border-b border-border-subtle">
        <div className="max-w-4xl mx-auto p-8 sm:p-10 bg-canvas-glacial border border-border-subtle rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 text-xs font-semibold rounded-full">
              <BookOpen size={14} />
              <span>Transparencia y Rigor Técnico</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-ink-primary">
              Sustento oficial de nuestras recomendaciones
            </h3>
            <p className="text-sm text-ink-muted max-w-xl">
              Nuestras pautas y cálculos se basan en las normas del Reglamento Nacional de Edificaciones (RNE E.030, E.070, E.080), manuales EVAR de CENEPRED y estudios de peligro aluvial de INAIGEM.
            </p>
          </div>
          <Link to="/fuentes" className="shrink-0">
            <button
              type="button"
              className="px-6 py-3 bg-canvas-surface hover:bg-sky-50 text-ink-primary font-bold border border-border-subtle rounded-xl text-sm transition-colors flex items-center gap-2 cursor-pointer min-h-[44px]"
            >
              <span>Ver fuentes oficiales</span>
              <ArrowRight size={16} className="text-sky-600" />
            </button>
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          6. DESCARGO LEGAL
          ------------------------------------------------------------------ */}
      <section className="py-8 px-4 sm:px-6 bg-sky-200/50 dark:bg-canvas-glacial border-b border-border-subtle text-center">
        <div className="max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted uppercase tracking-wider">
            <ShieldAlert size={15} className="text-sky-600" />
            <span>Aviso de Responsabilidad Cívica</span>
          </div>
          <p className="text-xs text-ink-muted leading-relaxed">
            Senda es una herramienta cívica y orientativa basada en cartografía oficial del Estado peruano. <strong>No sustituye la inspección técnica ocular ni el dictamen estructural presencial realizado por un ingeniero civil colegiado y habilitado.</strong>
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          7. LLAMADO FINAL A LA ACCIÓN
          ------------------------------------------------------------------ */}
      <section className="py-16 px-4 sm:px-6 bg-sky-200/70 dark:bg-canvas-surface/90">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
            <HeartHandshake size={28} />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink-primary">
              La protección de su familia empieza con información oportuna
            </h2>
            <p className="text-sm sm:text-base text-ink-muted max-w-lg mx-auto leading-relaxed">
              Conozca los peligros de su entorno antes de que ocurra la emergencia y tenga a mano su ruta de escape peatonal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleStartEvaluation}
              className="px-8 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-base shadow-xs transition-all cursor-pointer inline-flex items-center justify-center gap-2 min-h-[48px] active:scale-98"
            >
              <span>Evaluar mi vivienda ahora</span>
              <ArrowRight size={18} />
            </button>

            <Link to="/panico">
              <button
                type="button"
                className="px-6 py-3.5 bg-canvas-surface hover:bg-emergency-50 text-emergency-600 font-bold border border-emergency-200 rounded-xl text-sm transition-all cursor-pointer min-h-[48px] flex items-center justify-center gap-2"
              >
                <AlertTriangle size={16} />
                <span>Ruta de escape ante aluvión</span>
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
