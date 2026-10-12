import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Activity,
  Layers,
  Waves,
} from 'lucide-react';
import {
  type MultiHazardRiskResult,
  type RiskLevel,
} from '../../lib/riskEngine';
import { EmergencyKitView } from './EmergencyKitView';
import { LeadCaptureForm } from '../forms/LeadCaptureForm';
import { Button } from '../Button';
import { FileDown, Printer } from 'lucide-react';
import { generateRiskReportPdf } from '../../utils/pdfGenerator';

interface RiskReportProps {
  result: MultiHazardRiskResult;
  evaluacionId?: string;
  coordinates?: { lat: number; lng: number };
}

export const RiskReport: React.FC<RiskReportProps> = ({ result, evaluacionId, coordinates }) => {
  const {
    vulnerability,
    globalRiskLevel,
    globalRiskScore,
    criticalHazard,
    specificRisks,
    mitigationRecommendations,
  } = result;

  const levelColor = getLevelColor(globalRiskLevel);

  const handleDownloadPdf = () => {
    generateRiskReportPdf({
      result,
      evaluacionId,
      coordinates,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 text-ink-primary">
      {/* ------------------------------------------------------------------
          BARRA DE ACCIÓN: DESCARGA DE REPORTE TÉCNICO OFICIAL
          ------------------------------------------------------------------ */}
      <div className="p-4 bg-canvas-surface border border-border-subtle rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-sky-600 dark:text-sky-400 font-bold block">
            Documento Técnico Acreditado
          </span>
          <p className="text-sm font-bold text-ink-primary">
            Dictamen Técnico de Riesgo y Plan de Mitigación Estructural
          </p>
          <p className="text-xs text-ink-muted">
            Genera un documento PDF oficial con folio único, desgloses normativos RNE e insumos INDECI.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={handleDownloadPdf}
            variant="primary"
            size="md"
            className="flex items-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            <span>Descargar Reporte PDF</span>
          </Button>

          <Button
            onClick={handlePrint}
            variant="outline"
            size="md"
            className="flex items-center gap-2"
            title="Imprimir o guardar como PDF"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Imprimir</span>
          </Button>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          1. EVALUACIÓN GLOBAL (BLOQUE EDITORIAL PLANO, SIN SOMBRAS)
          ------------------------------------------------------------------ */}
      <div
        className="p-6 border-l-4 space-y-4"
        style={{
          borderLeftColor: levelColor.color,
          backgroundColor: levelColor.bg,
          borderTop: '1px solid #D6ECFB',
          borderRight: '1px solid #D6ECFB',
          borderBottom: '1px solid #D6ECFB',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#4A6C8C] font-bold block">
              Evaluación Técnica de Riesgo Multiamenaza
            </span>
            <h2 className="text-2xl font-bold text-[#0D3B66] mt-1">
              Nivel de Riesgo Global:{' '}
              <span style={{ color: levelColor.color }}>{globalRiskLevel}</span>
            </h2>
            <p className="text-base text-[#4A6C8C] mt-1">
              Amenaza condicionante principal: <strong className="text-[#0D3B66]">{criticalHazard}</strong>
            </p>
          </div>

          <div
            className="self-start sm:self-auto px-4 py-2 border flex items-center gap-2 font-bold text-base"
            style={{
              borderColor: levelColor.color,
              color: levelColor.color,
              backgroundColor: '#FFFFFF',
            }}
          >
            {globalRiskLevel === 'Muy Alto' || globalRiskLevel === 'Alto' ? (
              <AlertTriangle className="w-5 h-5" style={{ color: levelColor.color }} />
            ) : (
              <CheckCircle2 className="w-5 h-5" style={{ color: levelColor.color }} />
            )}
            <span>Índice Estimado: {(globalRiskScore * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* ALERTA DE DISPARADOR AUTOMÁTICO (HARD TRIGGER RNE) */}
        {vulnerability.hardTriggers.length > 0 && (
          <div className="p-4 bg-[#fdf5f3] border border-[#B34E36] space-y-3">
            {vulnerability.hardTriggers.map((trigger) => (
              <div key={trigger.id} className="flex items-start gap-3">
                <AlertOctagon className="w-6 h-6 text-[#B34E36] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[#B34E36]">
                    {trigger.title}
                  </h4>
                  <p className="text-sm text-[#7F1D1D]">
                    <strong>Base Normativa:</strong> {trigger.normReference}
                  </p>
                  <p className="text-sm text-[#4A6C8C] leading-relaxed">
                    {trigger.description}
                  </p>
                  <p className="text-sm font-bold text-[#B34E36]">
                    Consecuencia: {trigger.consequence}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------
          2. DESGLOSE MULTIAMENAZA (GRILLA EDITORIAL PLANA)
          ------------------------------------------------------------------ */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-[#0D3B66]">
          Desglose de Amenazas Específicas
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {specificRisks.sismo && (
            <HazardItem
              title="Sismo (RNE E.030)"
              icon={<Activity className="w-5 h-5 text-[#1E6FB5]" />}
              score={specificRisks.sismo.riskScore}
              level={specificRisks.sismo.level}
              hazardScore={specificRisks.sismo.hazardScore}
              status={specificRisks.sismo.status}
              statusMessage={specificRisks.sismo.statusMessage}
            />
          )}
          {specificRisks.aluvion && (
            <HazardItem
              title="Aluvión / GLOF"
              icon={<Waves className="w-5 h-5 text-[#1E6FB5]" />}
              score={specificRisks.aluvion.riskScore}
              level={specificRisks.aluvion.level}
              hazardScore={specificRisks.aluvion.hazardScore}
              status={specificRisks.aluvion.status}
              statusMessage={specificRisks.aluvion.statusMessage}
            />
          )}
          {specificRisks.movimiento_masa && (
            <HazardItem
              title="Movimiento en Masa"
              icon={<Layers className="w-5 h-5 text-[#1E6FB5]" />}
              score={specificRisks.movimiento_masa.riskScore}
              level={specificRisks.movimiento_masa.level}
              hazardScore={specificRisks.movimiento_masa.hazardScore}
              status={specificRisks.movimiento_masa.status}
              statusMessage={specificRisks.movimiento_masa.statusMessage}
            />
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------
          3. RECOMENDACIONES DE MITIGACIÓN ESTRUCTURAL (EDITORIAL PLANO)
          ------------------------------------------------------------------ */}
      <div className="p-6 bg-canvas-surface border border-border-subtle rounded-2xl space-y-3">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-sky-600" />
          <h3 className="text-lg font-bold text-ink-primary">
            Acciones Prioritarias de Mitigación
          </h3>
        </div>
        <ul className="space-y-2 pl-4 list-disc text-base text-ink-muted">
          {mitigationRecommendations.map((rec, i) => (
            <li key={i} className="leading-relaxed">
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* ------------------------------------------------------------------
          4. MOCHILA Y SUPERVIVENCIA INDECI
          ------------------------------------------------------------------ */}
      <EmergencyKitView cityId={result.cityId} />

      {/* ------------------------------------------------------------------
          5. FORMULARIO DE CAPTURA DE LEADS (SMOKE TEST)
          ------------------------------------------------------------------ */}
      <LeadCaptureForm evaluacionId={evaluacionId} />
    </div>
  );
};

interface HazardItemProps {
  title: string;
  icon: React.ReactNode;
  score?: number | null;
  level?: RiskLevel | 'Sin Afectación' | 'Datos Insuficientes';
  hazardScore?: number | null;
  status?: string;
  statusMessage?: string;
}

const HazardItem: React.FC<HazardItemProps> = ({
  title,
  icon,
  score,
  level = 'Sin Afectación',
  hazardScore,
  status = 'active',
  statusMessage,
}) => {
  const colors = getLevelColor(level);

  return (
    <div className="p-4 bg-canvas-surface border border-border-subtle rounded-2xl space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-bold text-ink-primary">{title}</span>
        </div>
        <span
          className="text-xs font-bold px-2 py-0.5 border"
          style={{
            color: colors.color,
            borderColor: colors.color,
            backgroundColor: colors.bg,
          }}
        >
          {level}
        </span>
      </div>

      {status === 'insufficient_data' ? (
        <div className="border-t border-[#D6ECFB] pt-2 text-xs text-[#4A6C8C] leading-relaxed">
          <span>{statusMessage || 'Sin cartografía técnica suficiente para este cuadrante.'}</span>
        </div>
      ) : status === 'no_hazard' || hazardScore === 0 ? (
        <div className="border-t border-[#D6ECFB] pt-2 text-xs text-[#3D6D4C] leading-relaxed">
          <span>✓ {statusMessage || 'Punto ubicado fuera de zonas de peligro registradas.'}</span>
        </div>
      ) : (
        <>
          <div className="flex justify-between text-xs text-[#4A6C8C] border-t border-[#D6ECFB] pt-2">
            <span>Exposición territorial:</span>
            <strong className="text-[#0D3B66]">
              {hazardScore !== null && hazardScore !== undefined
                ? `${(hazardScore * 100).toFixed(0)}%`
                : 'N/A'}
            </strong>
          </div>
          <div className="flex justify-between text-xs text-[#4A6C8C]">
            <span>Riesgo calculado:</span>
            <strong style={{ color: colors.color }}>
              {score !== null && score !== undefined ? `${(score * 100).toFixed(0)}%` : 'N/A'}
            </strong>
          </div>
        </>
      )}
    </div>
  );
};

function getLevelColor(level: RiskLevel | 'Sin Afectación' | 'Datos Insuficientes') {
  // Paleta oficial de Semáforo No Alarmante (Andean Design System)
  switch (level) {
    case 'Sin Afectación':
      return { bg: '#f2f7f4', color: '#3D6D4C' };
    case 'Datos Insuficientes':
      return { bg: '#f4f4f5', color: '#52525b' };
    case 'Bajo':
      return { bg: '#f2f7f4', color: '#3D6D4C' };
    case 'Medio':
      return { bg: '#fdfaf2', color: '#C89D3C' };
    case 'Alto':
      return { bg: '#fdf5f3', color: '#B34E36' };
    case 'Muy Alto':
      return { bg: '#fff1f2', color: '#7F1D1D' };
  }
}
