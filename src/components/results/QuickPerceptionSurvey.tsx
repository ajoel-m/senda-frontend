import React, { useState, useEffect } from 'react';
import { CheckCircle2, HelpCircle, ShieldAlert, Sparkles, Hammer } from 'lucide-react';
import { savePerceptionFeedback } from '../../services/supabase';

interface QuickPerceptionSurveyProps {
  evaluacionId?: string;
  cityId?: string;
}

export const QuickPerceptionSurvey: React.FC<QuickPerceptionSurveyProps> = ({
  evaluacionId,
  cityId,
}) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (evaluacionId) {
      const stored = localStorage.getItem(`survey_percep_${evaluacionId}`);
      if (stored) {
        setSelectedKey(stored);
        setSubmitted(true);
      }
    }
  }, [evaluacionId]);

  const handleSelect = async (key: 'no_conocia' | 'sospechaba' | 'reforzar') => {
    setSelectedKey(key);
    setIsSaving(true);

    try {
      await savePerceptionFeedback({
        evaluacionId,
        perceptionKey: key,
        cityId,
      });

      if (evaluacionId) {
        localStorage.setItem(`survey_percep_${evaluacionId}`, key);
      }
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setIsSaving(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-4 rounded-2xl bg-canvas-surface border border-life-600/30 shadow-2xs text-center space-y-1.5 animate-in fade-in duration-200">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-life-600">
          <CheckCircle2 size={16} />
          <span>¡Aporte registrado!</span>
        </div>
        {selectedKey === 'no_conocia' && (
          <span className="text-[11px] font-semibold text-emergency-600 block">
            Tu respuesta: No conocías este nivel de peligro estructural.
          </span>
        )}
        {selectedKey === 'sospechaba' && (
          <span className="text-[11px] font-semibold text-amber-700 block">
            Tu respuesta: Ya sospechabas de la vulnerabilidad en tu vivienda.
          </span>
        )}
        {selectedKey === 'reforzar' && (
          <span className="text-[11px] font-semibold text-life-600 block">
            Tu respuesta: Identificaste la necesidad de reforzar tu vivienda.
          </span>
        )}
        <p className="text-xs text-ink-muted leading-relaxed">
          Tu respuesta anónima ayuda a enriquecer el mapa de percepción comunitaria del riesgo en tu ciudad.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-canvas-surface border border-border-subtle shadow-xs space-y-3.5">
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
          <HelpCircle size={16} />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
            Consulta rápida de percepción cívica
          </h4>
          <p className="text-sm font-extrabold text-ink-primary leading-snug mt-0.5">
            ¿Esta evaluación cambió tu percepción sobre el peligro en tu casa?
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        <button
          type="button"
          disabled={isSaving}
          onClick={() => handleSelect('no_conocia')}
          className="p-3 text-left border rounded-xl border-border-subtle bg-canvas-surface hover:border-sky-500 hover:bg-sky-50/40 transition-all cursor-pointer flex items-center gap-2 text-xs font-bold text-ink-primary active:scale-98"
        >
          <ShieldAlert size={16} className="text-emergency-600 shrink-0" />
          <span className="leading-snug">Sí, no conocía este riesgo</span>
        </button>

        <button
          type="button"
          disabled={isSaving}
          onClick={() => handleSelect('sospechaba')}
          className="p-3 text-left border rounded-xl border-border-subtle bg-canvas-surface hover:border-sky-500 hover:bg-sky-50/40 transition-all cursor-pointer flex items-center gap-2 text-xs font-bold text-ink-primary active:scale-98"
        >
          <Sparkles size={16} className="text-amber-600 shrink-0" />
          <span className="leading-snug">Ya sospechaba del peligro</span>
        </button>

        <button
          type="button"
          disabled={isSaving}
          onClick={() => handleSelect('reforzar')}
          className="p-3 text-left border rounded-xl border-border-subtle bg-canvas-surface hover:border-sky-500 hover:bg-sky-50/40 transition-all cursor-pointer flex items-center gap-2 text-xs font-bold text-ink-primary active:scale-98"
        >
          <Hammer size={16} className="text-life-600 shrink-0" />
          <span className="leading-snug">Necesito reforzar mi casa</span>
        </button>
      </div>
    </div>
  );
};
