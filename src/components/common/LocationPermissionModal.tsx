import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onManual: () => void;
  isLoading?: boolean;
}

export const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  isOpen,
  onAllow,
  onManual,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink-primary/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-canvas-surface border border-border-subtle rounded-2xl p-6 shadow-xl text-center space-y-5 text-ink-primary"
      >
        {/* Ícono de Ubicación Cívica */}
        <div className="w-14 h-14 mx-auto rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
          <MapPin size={28} />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold uppercase tracking-wide text-ink-primary">
            Ubicación Requerida
          </h2>
          <p className="text-sm text-ink-muted leading-relaxed">
            Para saber si tu casa está expuesta a zonas de peligro de sismo o aluvión, y trazar tu ruta de escape más segura, necesitamos tu ubicación.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={onAllow}
            disabled={isLoading}
            className="w-full py-3 px-4 min-h-[48px] bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <MapPin size={18} />
            <span>{isLoading ? 'Detectando GPS...' : 'Permitir Ubicación'}</span>
          </button>

          <button
            type="button"
            onClick={onManual}
            disabled={isLoading}
            className="w-full py-3 px-4 min-h-[48px] bg-canvas-glacial hover:bg-sky-50 text-ink-primary border border-border-subtle font-semibold text-sm rounded-xl transition-colors cursor-pointer"
          >
            <span>Ingresar Manualmente</span>
          </button>
        </div>

        <div className="pt-1">
          <span className="text-[11px] text-ink-muted">
            Tus datos de ubicación son privados y solo se usan en tu dispositivo.
          </span>
        </div>
      </div>
    </div>
  );
};
