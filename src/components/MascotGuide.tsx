import React from 'react';
import { Info, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

export type MascotMood = 'explaining' | 'warning' | 'success' | 'neutral' | 'exploring';

export interface MascotGuideProps {
  mood?: MascotMood;
  title?: string;
  text: string;
  className?: string;
  compact?: boolean;
}

const MOOD_STYLES: Record<
  MascotMood,
  {
    border: string;
    bg: string;
    iconColor: string;
    badgeBg: string;
    badgeText: string;
    icon: React.ReactNode;
    defaultTitle: string;
    mascotSrc: string;
    mascotAlt: string;
  }
> = {
  explaining: {
    border: 'border-sky-600',
    bg: 'bg-canvas-surface',
    iconColor: 'text-sky-600 dark:text-sky-400',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/60',
    badgeText: 'text-sky-700 dark:text-sky-300',
    icon: <Info size={16} className="text-sky-600 dark:text-sky-400" />,
    defaultTitle: 'Alertin te explica',
    mascotSrc: '/mascots/alertin_previene.svg',
    mascotAlt: 'Alertin explicando con un libro',
  },
  warning: {
    border: 'border-[#FF8A3D]',
    bg: 'bg-[#FFF1E7] dark:bg-amber-950/30',
    iconColor: 'text-[#FF8A3D]',
    badgeBg: 'bg-[#FF8A3D]/10 dark:bg-amber-900/40',
    badgeText: 'text-[#FF8A3D]',
    icon: <AlertTriangle size={16} className="text-[#FF8A3D]" />,
    defaultTitle: 'Atención preventiva',
    mascotSrc: '/mascots/alertin_principal.svg',
    mascotAlt: 'Alertin en alerta',
    // nota: SENDA no tiene un naranja de "alerta" separado del de marca;
    // se usa Ruta (#FF8A3D) para no confundir con el rojo de emergencia.
  },
  success: {
    border: 'border-emerald-600',
    bg: 'bg-[#ECFDF5] dark:bg-emerald-950/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    icon: <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400" />,
    defaultTitle: '¡Excelente decisión!',
    mascotSrc: '/mascots/alertin_vamos.svg',
    mascotAlt: 'Alertin animando con el pulgar arriba',
  },
  neutral: {
    border: 'border-border-subtle',
    bg: 'bg-canvas-surface',
    iconColor: 'text-ink-muted',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/60',
    badgeText: 'text-ink-primary',
    icon: <HelpCircle size={16} className="text-ink-muted" />,
    defaultTitle: 'Guía comunitaria',
    mascotSrc: '/mascots/alertin_principal.svg',
    mascotAlt: 'Alertin, la mascota de Senda',
  },
  exploring: {
    border: 'border-sky-600',
    bg: 'bg-canvas-surface',
    iconColor: 'text-sky-600 dark:text-sky-400',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/60',
    badgeText: 'text-sky-700 dark:text-sky-300',
    icon: <Info size={16} className="text-sky-600 dark:text-sky-400" />,
    defaultTitle: 'Alertin explora contigo',
    mascotSrc: '/mascots/alertin_explora.svg',
    mascotAlt: 'Alertin explorando con un mapa',
  },
};

/**
 * Componente de mascota — Alertin
 * Acompaña al usuario en puntos clave de la evaluación con consejos accesibles,
 * tono empático y sin tecnicismos alarmistas.
 */
export const MascotGuide: React.FC<MascotGuideProps> = ({
  mood = 'explaining',
  title,
  text,
  className = '',
  compact = false,
}) => {
  const currentMood = MOOD_STYLES[mood];
  const finalTitle = title || currentMood.defaultTitle;

  if (compact) {
    return (
      <aside
        role="status"
        aria-live="polite"
        className={`p-3 rounded-2xl border-l-4 ${currentMood.border} ${currentMood.bg} flex items-start gap-3 text-xs sm:text-sm text-ink-primary ${className}`}
      >
        <div className="w-8 h-8 shrink-0 rounded-xl bg-sky-100 dark:bg-sky-950/80 flex items-center justify-center select-none border border-border-subtle overflow-hidden">
          <img src={currentMood.mascotSrc} alt={currentMood.mascotAlt} className="w-full h-full object-contain" />
        </div>
        <div className="flex-1 space-y-0.5">
          <div className="flex items-center gap-1.5 font-bold text-xs">
            {currentMood.icon}
            <span className={currentMood.iconColor}>{finalTitle}</span>
          </div>
          <p className="text-ink-muted leading-relaxed">{text}</p>
        </div>
      </aside>
    );
  }

  return (
    <aside
      role="status"
      aria-live="polite"
      className={`p-4 sm:p-5 rounded-2xl border ${currentMood.border} ${currentMood.bg} flex flex-col sm:flex-row items-start gap-4 ${className}`}
    >
      <div
        className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-sky-100 dark:bg-sky-950/80 border border-sky-600/30 flex flex-col items-center justify-center select-none overflow-hidden"
        title="Alertin"
      >
        <img src={currentMood.mascotSrc} alt={currentMood.mascotAlt} className="w-full h-full object-contain" />
      </div>

      <div className="flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${currentMood.badgeBg} ${currentMood.badgeText}`}
          >
            {finalTitle}
          </span>
        </div>
        <p className="text-sm text-ink-primary leading-relaxed">{text}</p>
      </div>
    </aside>
  );
};
