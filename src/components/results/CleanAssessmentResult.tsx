import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  FileDown,
  BookOpen,
  AlertTriangle,
  Waves,
  Mountain,
  ShieldCheck,
  CheckCircle2,
  Backpack,
} from 'lucide-react';
import {
  type MultiHazardRiskResult,
  type RiskLevel,
} from '../../lib/riskEngine';
import { EmergencyKitView } from './EmergencyKitView';
import { QuickPerceptionSurvey } from './QuickPerceptionSurvey';
import { generateRiskReportPdf } from '../../utils/pdfGenerator';
import { MascotGuide } from '../MascotGuide';

interface CleanAssessmentResultProps {
  result: MultiHazardRiskResult;
  evaluacionId?: string;
  coordinates?: { lat: number; lng: number };
}

export const CleanAssessmentResult: React.FC<CleanAssessmentResultProps> = ({
  result,
  evaluacionId,
  coordinates,
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [showBackpack, setShowBackpack] = useState(false);
  const {
    globalRiskLevel,
    globalRiskScore,
    criticalHazard,
    mitigationRecommendations,
    vulnerability,
    specificRisks,
    cityId,
  } = result;

  // Semáforo mineral accesible
  const getSemaphoreConfig = (level: RiskLevel) => {
    switch (level) {
      case 'Bajo':
        return {
          label: 'VERDE',
          sublabel: 'Riesgo Bajo',
          bg: 'bg-[#E8F5E9]',
          border: 'border-[#1B5E20]',
          text: 'text-[#1B5E20]',
        };
      case 'Medio':
        return {
          label: 'AMARILLO',
          sublabel: 'Riesgo Medio',
          bg: 'bg-[#FEF3C7]',
          border: 'border-[#B7791F]',
          text: 'text-[#B7791F]',
        };
      case 'Alto':
      case 'Muy Alto':
      default:
        return {
          label: 'ROJO',
          sublabel: level === 'Muy Alto' ? 'Riesgo Muy Alto' : 'Riesgo Alto',
          bg: 'bg-[#FEE2E2]',
          border: 'border-[#C2273D]',
          text: 'text-[#C2273D]',
        };
    }
  };

  const sem = getSemaphoreConfig(globalRiskLevel);

  const handleDownloadPdf = () => {
    generateRiskReportPdf({
      result,
      evaluacionId,
      coordinates,
    });
  };

  const renderHazardRiskBadge = (level: string | undefined, status: string | undefined) => {
    if (status === 'no_hazard' || level === 'Sin Afectación') {
      return (
        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
          <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
          <span>Sin peligro registrado (Seguro)</span>
        </span>
      );
    }
    if (status === 'insufficient_data' || level === 'Datos Insuficientes') {
      return (
        <span className="text-[11px] font-bold text-ink-muted bg-canvas-glacial border border-border-subtle px-2.5 py-1 rounded-lg">
          Sin datos suficientes
        </span>
      );
    }
    if (!level) {
      return (
        <span className="text-[11px] font-bold text-ink-muted bg-canvas-glacial border border-border-subtle px-2.5 py-1 rounded-lg">
          No aplica en esta región
        </span>
      );
    }

    const isHigh = level === 'Alto' || level === 'Muy Alto';
    const isMedium = level === 'Medio';

    return (
      <span
        className={`text-[11px] font-bold border px-2.5 py-1 rounded-lg inline-flex items-center gap-1 ${
          isHigh
            ? 'bg-emergency-50 text-emergency-700 border-emergency-300'
            : isMedium
            ? 'bg-amber-50 text-amber-800 border-amber-300'
            : 'bg-emerald-50 text-emerald-700 border-emerald-300'
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isHigh ? 'bg-emergency-600' : isMedium ? 'bg-amber-500' : 'bg-emerald-500'
          }`}
        />
        <span>Riesgo {level}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <MascotGuide
        compact
        mood="success"
        title="¡Evaluación completada!"
        text="Alertin ya revisó tu vivienda. Esto es lo que encontramos — sea cual sea el resultado, ya diste el primer paso para estar más preparado."
      />

      {/* -------------------------------------------------------------
          1. TARJETA SEMÁFORO DE RIESGO GENERAL
          ------------------------------------------------------------- */}
      <div className="bg-canvas-surface border border-border-subtle rounded-2xl p-6 text-center space-y-4 shadow-xs">
        <span className="text-xs font-mono uppercase tracking-widest text-ink-muted font-bold block">
          SEMÁFORO DE RIESGO GENERAL
        </span>

        {/* Bloque Central de Semáforo */}
        <div className={`p-5 rounded-2xl border-2 ${sem.border} ${sem.bg} space-y-1 shadow-2xs`}>
          <span className={`text-4xl font-black tracking-tight ${sem.text} block`}>
            {sem.label}
          </span>
          <span className={`text-sm font-extrabold uppercase tracking-wide ${sem.text} block`}>
            {sem.sublabel}
          </span>
          <span className="text-xs text-ink-primary block pt-1">
            Amenaza condicionante principal: <strong>{criticalHazard}</strong>
          </span>
        </div>

        {/* Acciones Recomendadas Inmediatas */}
        <div className="text-left space-y-2 pt-2 border-t border-border-subtle">
          <span className="text-xs font-bold text-ink-primary uppercase tracking-wide block">
            Acciones Recomendadas Inmediatas:
          </span>
          <ul className="space-y-1.5 text-xs text-ink-muted">
            {mitigationRecommendations.slice(0, 3).map((rec, i) => (
              <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                <span className="text-sky-600 font-bold shrink-0">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Botón Discreto: "Ver Respaldo Técnico" */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="w-full py-2.5 px-4 bg-canvas-glacial hover:bg-sky-50 text-ink-primary text-xs font-bold rounded-xl border border-border-subtle flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookOpen size={15} className="text-sky-600" />
            <span>{showTechnicalDetails ? 'Ocultar Respaldo Técnico' : 'Ver Respaldo Técnico'}</span>
            {showTechnicalDetails ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>

        {/* Botón de Descarga PDF */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-98"
          >
            <FileDown size={15} />
            <span>Descargar Dictamen en PDF</span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
          2. DESGLOSE DE RIESGO POR CADA AMENAZA OFICIAL (CERO INVENTOS)
          ------------------------------------------------------------- */}
      <div className="bg-canvas-surface border border-border-subtle rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-sky-600" />
            <h3 className="font-bold text-sm text-ink-primary">
              Desglose de Riesgos por Cada Desastre Natural
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
            Cartografía Oficial
          </span>
        </div>

        <p className="text-xs text-ink-muted leading-relaxed">
          Los niveles se calculan cruzando tus materiales con los mapas del CISMID, INAIGEM y SIGRID. Si el punto no interseca zonas de peligro, no se simulan riesgos inexistentes.
        </p>

        <div className="space-y-2.5 pt-1">
          {/* Fila Sismo */}
          <div className="p-3 bg-canvas-glacial border border-border-subtle rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-100/70 text-sky-700 flex items-center justify-center shrink-0">
                <AlertTriangle size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-ink-primary block">
                  Sismos y Terremotos
                </span>
                <span className="text-[11px] text-ink-muted block">
                  Reglamento Nacional de Edificaciones RNE E.030
                </span>
              </div>
            </div>
            <div>
              {renderHazardRiskBadge(
                specificRisks.sismo?.level,
                specificRisks.sismo?.status
              )}
            </div>
          </div>

          {/* Fila Aluvión / GLOF */}
          <div className="p-3 bg-canvas-glacial border border-border-subtle rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-100/70 text-cyan-800 flex items-center justify-center shrink-0">
                <Waves size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-ink-primary block">
                  Aluvión Glaciar (GLOF)
                </span>
                <span className="text-[11px] text-ink-muted block">
                  {cityId === 'huaraz'
                    ? 'Modelamiento INAIGEM / SAT-Palcacocha (Quillcay)'
                    : 'No aplica a Lima Metropolitana'}
                </span>
              </div>
            </div>
            <div>
              {cityId === 'huaraz' ? (
                renderHazardRiskBadge(
                  specificRisks.aluvion?.level,
                  specificRisks.aluvion?.status
                )
              ) : (
                <span className="text-[11px] font-bold text-ink-muted bg-canvas-surface border border-border-subtle px-2.5 py-1 rounded-lg">
                  No aplica en Lima
                </span>
              )}
            </div>
          </div>

          {/* Fila Movimientos en Masa / Laderas */}
          <div className="p-3 bg-canvas-glacial border border-border-subtle rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
                <Mountain size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-ink-primary block">
                  Laderas y Deslizamientos
                </span>
                <span className="text-[11px] text-ink-muted block">
                  Susceptibilidad geológica CENEPRED / SIGRID
                </span>
              </div>
            </div>
            <div>
              {renderHazardRiskBadge(
                specificRisks.movimiento_masa?.level,
                specificRisks.movimiento_masa?.status
              )}
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          3. SUSTENTO TÉCNICO Y NORMATIVO RNE (COLAPSABLE)
          ------------------------------------------------------------- */}
      {showTechnicalDetails && (
        <div className="bg-canvas-surface border border-border-subtle rounded-2xl p-5 space-y-4 text-xs shadow-xs animate-in fade-in duration-200">
          <div className="border-b border-border-subtle pb-2">
            <h4 className="font-bold text-ink-primary text-sm">
              Sustento Científico y Normativo (Perú)
            </h4>
            <p className="text-[11px] text-ink-muted">
              Cálculo basado en el Proceso Analítico Jerárquico de Saaty (CENEPRED) y RNE.
            </p>
          </div>

          <div className="space-y-2 text-ink-muted leading-relaxed">
            <p>
              • <strong className="text-ink-primary">Índice de Vulnerabilidad Físico:</strong> {(vulnerability.normalizedScore * 100).toFixed(1)}% (Nivel: {vulnerability.level}).
            </p>
            <p>
              • <strong className="text-ink-primary">Riesgo Global Estimado:</strong> {(globalRiskScore * 100).toFixed(1)}%.
            </p>
            {vulnerability.hardTriggers.length > 0 && (
              <div className="p-3 bg-emergency-50 border border-emergency-200 rounded-xl space-y-1 text-emergency-600">
                <strong className="block">Infracción Técnica Crítica Detectada:</strong>
                {vulnerability.hardTriggers.map((t) => (
                  <span key={t.id} className="block text-[11px]">
                    {t.title} — {t.normReference}
                  </span>
                ))}
              </div>
            )}
            <p className="pt-1 text-[11px]">
              Normas de referencia: RNE E.030 (Diseño Sismorresistente), E.070 (Albañilería), E.080 (Tierra Reforzada) y Manual EVAR v2 de CENEPRED.
            </p>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          4. MOCHILA DE EMERGENCIA INTERACTIVA CON GATILLO LIMPIO
          ------------------------------------------------------------- */}
      <div className="bg-canvas-surface border border-border-subtle rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-dawn-amber/20 border border-dawn-amber/40 flex items-center justify-center text-amber-800 shrink-0">
              <Backpack size={26} />
            </div>
            <div>
              <h3 className="text-base font-black text-ink-primary">
                Mochila de Emergencia INDECI
              </h3>
              <p className="text-xs text-ink-muted">
                Calculada para 2 personas según los riesgos detectados en tu hogar.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowBackpack(!showBackpack)}
            className="py-2.5 px-4 rounded-xl bg-ink-primary hover:bg-ink-primary/90 text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer self-start sm:self-auto shadow-xs"
          >
            <Backpack size={15} />
            <span>{showBackpack ? 'Ocultar Mochila' : 'Ver tu Mochila de Emergencia'}</span>
            {showBackpack ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>

        {/* Despliegue interactivo sin saturar la pantalla principal */}
        {showBackpack && (
          <div className="pt-4 border-t border-border-subtle animate-in fade-in duration-200">
            <MascotGuide
              compact
              mood="explaining"
              title="Alertin te ayuda con tu mochila"
              text="Marca lo que ya tengas listo en casa y prepara lo que te falte con calma."
            />
            <div className="pt-3">
              <EmergencyKitView cityId={cityId} />
            </div>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------
          5. MICRO-CONSULTA DISCRETA DE PERCEPCIÓN CÍVICA (PITCH / IMPACTO)
          ------------------------------------------------------------- */}
      <QuickPerceptionSurvey evaluacionId={evaluacionId} cityId={cityId} />
    </div>
  );
};
