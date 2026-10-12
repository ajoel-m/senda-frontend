import React, { useState } from 'react';
import { Heart, MessageSquare, Check, X } from 'lucide-react';
import { saveTrustFeedback } from '../../services/supabase';

export const TrustFeedbackWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // No mostrar si ya lo respondió en esta sesión
  const alreadyAnswered = typeof window !== 'undefined' && sessionStorage.getItem('trust_feedback_answered');
  if (alreadyAnswered) return null;

  const handleResponse = (val: 'yes' | 'no') => {
    setSubmitted(true);
    sessionStorage.setItem('trust_feedback_answered', 'true');

    // Persistencia asíncrona hacia Supabase (con fallback local)
    saveTrustFeedback({
      confia: val === 'yes',
      respuesta_texto: val,
      ruta: typeof window !== 'undefined' ? window.location.pathname : undefined,
    });

    setTimeout(() => {
      setIsOpen(false);
    }, 2200);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-3.5 py-2 bg-canvas-surface border border-border-subtle text-ink-primary rounded-full shadow-md hover:border-sky-400 flex items-center gap-2 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
          title="Evalúa nuestra plataforma"
        >
          <MessageSquare size={15} className="text-sky-600" />
          <span className="hidden sm:inline">¿Te es útil esta información?</span>
        </button>
      ) : (
        <div className="w-72 bg-canvas-surface border border-border-subtle rounded-2xl p-4 shadow-xl space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-ink-primary">
              <Heart size={15} className="text-emergency-600" />
              <span>Evaluación Ciudadana</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-ink-muted hover:text-ink-primary p-0.5 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {!submitted ? (
            <>
              <p className="text-xs text-ink-muted leading-relaxed">
                ¿Confías en las recomendaciones y datos que te brinda Senda?
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleResponse('yes')}
                  className="flex-1 py-1.5 bg-life-50 hover:bg-life-100 text-life-600 border border-life-200 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Sí, confío
                </button>
                <button
                  type="button"
                  onClick={() => handleResponse('no')}
                  className="flex-1 py-1.5 bg-emergency-50 hover:bg-emergency-100 text-emergency-600 border border-emergency-200 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Tengo dudas
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-2 space-y-1">
              <Check size={20} className="mx-auto text-life-600" />
              <p className="text-xs font-bold text-life-600">
                ¡Gracias por tu respuesta!
              </p>
              <p className="text-[10px] text-ink-muted">
                Nos ayuda a mejorar la transparencia cívica.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
