import React from 'react';
import { Home, ShieldAlert, Footprints } from 'lucide-react';
import { getCommunityKPIs } from '../../services/supabase';

interface CommunityMetricsBannerProps {
  compact?: boolean;
}

export const CommunityMetricsBanner: React.FC<CommunityMetricsBannerProps> = ({ compact = false }) => {
  const kpis = getCommunityKPIs();

  return (
    <div className={`w-full rounded-2xl bg-canvas-surface/95 border border-border-subtle shadow-xs backdrop-blur-xs ${compact ? 'p-3.5 sm:p-4' : 'p-5 sm:p-6'}`}>
      <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-4">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted">
          Impacto Cívico de la Plataforma
        </span>
        <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
          Datos en Tiempo Real
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-border-subtle">
        {/* KPI 1: Evaluaciones */}
        <div className="flex items-start gap-3 pt-2 sm:pt-0 sm:px-2 first:pl-0">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
            <Home size={18} />
          </div>
          <div>
            <div className="font-display text-2xl font-black text-ink-primary leading-none tracking-tight">
              +{kpis.totalEvaluations.toLocaleString()}
            </div>
            <div className="text-xs font-bold text-ink-primary mt-1">
              Viviendas evaluadas
            </div>
            <div className="text-[11px] text-ink-muted leading-tight mt-0.5">
              En zonas de riesgo de Huaraz y Lima
            </div>
          </div>
        </div>

        {/* KPI 2: Vulnerabilidad Crítica */}
        <div className="flex items-start gap-3 pt-3 sm:pt-0 sm:px-4">
          <div className="w-10 h-10 rounded-xl bg-emergency-50 text-emergency-600 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert size={18} />
          </div>
          <div>
            <div className="font-display text-2xl font-black text-emergency-600 leading-none tracking-tight">
              {kpis.criticalVulnerabilityPct}%
            </div>
            <div className="text-xs font-bold text-ink-primary mt-1">
              Vulnerabilidad crítica
            </div>
            <div className="text-[11px] text-ink-muted leading-tight mt-0.5">
              Muros no confinados o ladrillo tubular
            </div>
          </div>
        </div>

        {/* KPI 3: Distancia a Refugio */}
        <div className="flex items-start gap-3 pt-3 sm:pt-0 sm:px-4 last:pr-0">
          <div className="w-10 h-10 rounded-xl bg-life-50 text-life-600 flex items-center justify-center shrink-0 mt-0.5">
            <Footprints size={18} />
          </div>
          <div>
            <div className="font-display text-2xl font-black text-life-600 leading-none tracking-tight">
              &lt; 400 m
            </div>
            <div className="text-xs font-bold text-ink-primary mt-1">
              Distancia a refugio
            </div>
            <div className="text-[11px] text-ink-muted leading-tight mt-0.5">
              Promedio de escape peatonal seguro
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
