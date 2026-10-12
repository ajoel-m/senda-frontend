import React, { useEffect, useState } from 'react';

export interface AnalysisStep {
  id: string;
  label: string;
  detail: string;
}

interface AnalysisLoadingOverlayProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  steps: AnalysisStep[];
  onComplete: () => void;
  minDurationMs?: number;
}

/**
 * Antes mostraba un ícono de carga genérico girando. Ahora, como en la
 * versión anterior de Amy, Alertin acompaña una burbuja a la vez con el
 * paso que se está procesando (label + detail), en vez de un spinner solo.
 */
export const AnalysisLoadingOverlay: React.FC<AnalysisLoadingOverlayProps> = ({
  isOpen,
  title,
  subtitle,
  steps,
  onComplete,
  minDurationMs = 2200,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      return;
    }

    const totalSteps = steps.length;
    const intervalMs = Math.floor(minDurationMs / totalSteps);

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < totalSteps - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 350);
          return prev;
        }
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isOpen, steps.length, minDurationMs, onComplete]);

  if (!isOpen) return null;

  const currentStep = steps[currentStepIndex];
  const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  return (
    <div
      className="fixed inset-0 z-[100] bg-ink-primary/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-analysis-title"
    >
      <div className="w-full max-w-sm bg-canvas-surface border border-border-subtle rounded-2xl p-6 sm:p-7 space-y-5 text-ink-primary text-center shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="space-y-1">
          <span id="loading-analysis-title" className="text-xs font-mono uppercase tracking-widest text-sky-700 font-bold block">
            {title} · {progressPercent}%
          </span>
          <p className="text-sm text-ink-muted">{subtitle}</p>
        </div>

        {/* Burbuja única, secuencial: Alertin acompaña el paso actual */}
        <div
          className="flex items-center gap-3 rounded-2xl bg-canvas-glacial border border-border-subtle p-4 min-h-[76px] text-left"
          key={currentStep.id}
        >
          <div className="w-10 h-10 shrink-0 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center overflow-hidden animate-check-pop">
            <img
              src="/mascots/alertin_explora.svg"
              alt="Alertin explorando los datos"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0 animate-check-pop">
            <p className="font-bold text-[13.5px] text-ink-primary leading-snug">
              {currentStep.label}
            </p>
            <p className="text-[12px] text-ink-muted leading-snug mt-0.5">
              {currentStep.detail}
            </p>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="space-y-1.5">
          <div className="w-full bg-border-subtle h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-sky-600 h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-ink-muted font-medium block">
            Paso {currentStepIndex + 1} de {steps.length}
          </p>
        </div>
      </div>
    </div>
  );
};
