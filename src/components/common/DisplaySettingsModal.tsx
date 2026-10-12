import React from 'react';
import { X, Sun, Moon, Check, RotateCcw, Minus, Plus, Eye } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface DisplaySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisplaySettingsModal: React.FC<DisplaySettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    increaseFontSize,
    decreaseFontSize,
    fontSizeOptions,
    currentFontOption,
  } = useTheme();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="display-settings-title"
    >
      <div className="w-full max-w-md bg-canvas-surface border border-border-subtle rounded-3xl p-6 sm:p-7 space-y-6 text-ink-primary relative shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-300 flex items-center justify-center">
              <Eye size={20} />
            </div>
            <div>
              <h2 id="display-settings-title" className="text-lg font-bold text-ink-primary leading-tight">
                Accesibilidad y Apariencia
              </h2>
              <p className="text-xs text-ink-muted">Personaliza la lectura y el contraste</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-ink-muted hover:text-ink-primary rounded-xl hover:bg-canvas-glacial transition-colors cursor-pointer"
            aria-label="Cerrar ajustes de apariencia"
          >
            <X size={20} />
          </button>
        </div>

        {/* 1. SECCIÓN: TEMA / MODO OSCURO */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Modo de Color
            </span>
            <span className="text-xs font-medium text-sky-600 dark:text-sky-400">
              {theme === 'dark' ? 'Oscuro activo' : 'Claro activo'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Opción Claro */}
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                theme === 'light'
                  ? 'border-sky-600 bg-sky-50/70 text-sky-700 shadow-2xs font-bold ring-2 ring-sky-300'
                  : 'border-border-subtle bg-canvas-surface hover:bg-canvas-glacial text-ink-primary'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  theme === 'light' ? 'bg-sky-600 text-white' : 'bg-canvas-glacial text-ink-muted'
                }`}
              >
                <Sun size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-sm font-bold">Modo Claro</span>
                <span className="block text-[11px] text-ink-muted">Luz diurna SENDA</span>
              </div>
              {theme === 'light' && <Check size={16} className="text-sky-600 shrink-0" />}
            </button>

            {/* Opción Oscuro */}
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                theme === 'dark'
                  ? 'border-sky-400 bg-sky-950/60 text-sky-200 shadow-2xs font-bold ring-2 ring-sky-500'
                  : 'border-border-subtle bg-canvas-surface hover:bg-canvas-glacial text-ink-primary'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  theme === 'dark' ? 'bg-sky-500 text-white' : 'bg-canvas-glacial text-ink-muted'
                }`}
              >
                <Moon size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-sm font-bold">Modo Oscuro</span>
                <span className="block text-[11px] text-ink-muted">Noche Andina</span>
              </div>
              {theme === 'dark' && <Check size={16} className="text-sky-400 shrink-0" />}
            </button>
          </div>
        </div>

        {/* 2. SECCIÓN: TAMAÑO DE LA LETRA */}
        <div className="space-y-3 pt-2 border-t border-border-subtle">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
                Tamaño de Letra
              </span>
              <span className="text-xs text-sky-700 dark:text-sky-300 font-bold">
                {currentFontOption.label} ({currentFontOption.percentage} · {currentFontOption.sizePx}px)
              </span>
            </div>

            {/* Botones de aumento / disminución rápida */}
            <div className="flex items-center gap-1.5 bg-canvas-glacial border border-border-subtle p-1 rounded-xl">
              <button
                type="button"
                onClick={decreaseFontSize}
                disabled={fontSize === 'sm'}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-primary hover:bg-canvas-surface disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Disminuir tamaño de letra"
                aria-label="Disminuir tamaño de letra"
              >
                <Minus size={15} />
              </button>
              <span className="font-mono text-xs font-bold px-1.5 text-ink-primary">
                A
              </span>
              <button
                type="button"
                onClick={increaseFontSize}
                disabled={fontSize === 'xl'}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-primary hover:bg-canvas-surface disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Aumentar tamaño de letra"
                aria-label="Aumentar tamaño de letra"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          {/* Opciones en cuadrícula de 2x2 */}
          <div className="grid grid-cols-2 gap-2">
            {fontSizeOptions.map((opt) => {
              const active = fontSize === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFontSize(opt.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    active
                      ? 'border-sky-600 bg-sky-50/70 dark:bg-sky-950/60 dark:border-sky-400 font-bold shadow-2xs ring-2 ring-sky-300 dark:ring-sky-500'
                      : 'border-border-subtle bg-canvas-surface hover:bg-canvas-glacial text-ink-primary'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="font-black text-sky-600 dark:text-sky-300 leading-none"
                      style={{ fontSize: `${opt.sizePx}px` }}
                    >
                      Aa
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-canvas-glacial text-ink-muted border border-border-subtle">
                      {opt.percentage}
                    </span>
                  </div>
                  <span className="block text-xs font-bold text-ink-primary">{opt.label}</span>
                  <span className="block text-[10px] text-ink-muted leading-tight mt-0.5">
                    {opt.sublabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Caja de Vista Previa en Vivo */}
          <div className="p-3.5 bg-canvas-glacial border border-border-subtle rounded-2xl space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-ink-muted block">
              Vista previa en tiempo real
            </span>
            <p className="text-ink-primary leading-snug">
              SENDA facilita la evaluación rápida y rutas seguras ante sismos y aluviones.
            </p>
          </div>
        </div>

        {/* Pie de acciones del modal */}
        <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
          <button
            type="button"
            onClick={() => {
              setTheme('light');
              setFontSize('base');
            }}
            className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-sky-600 transition-colors font-medium cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Restablecer</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 min-h-[40px] bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
