import React, { useState } from 'react';
import { X, ShieldCheck, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, signInWithGoogle, intendedPath } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle(intendedPath || '/evaluar');
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'No se pudo conectar con el servicio de autenticación de Google.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-ink-primary/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="w-full max-w-md bg-canvas-surface border border-border-subtle rounded-2xl p-6 sm:p-8 space-y-6 text-ink-primary relative shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Botón de Cierre */}
        <button
          type="button"
          onClick={closeAuthModal}
          disabled={loading}
          className="absolute top-4 right-4 p-2 text-ink-muted hover:text-ink-primary rounded-lg transition-colors cursor-pointer"
          aria-label="Cerrar ventana de autenticación"
        >
          <X size={20} />
        </button>

        {/* Cabecera */}
        <div className="space-y-2 border-b border-border-subtle pb-4 pr-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-sky-50 text-xs font-semibold text-sky-700 uppercase tracking-wider rounded-md">
            <Lock size={12} />
            <span>Acceso Seguro</span>
          </div>

          <h2 id="auth-modal-title" className="text-2xl font-bold text-ink-primary">
            Ingresa para Evaluar tu Vivienda
          </h2>

          <p className="text-sm text-ink-muted leading-relaxed">
            Para realizar el diagnóstico cívico y resguardar tu dictamen en la nube, accede con tu cuenta de Google.
          </p>
        </div>

        {/* Beneficios de Autenticarse */}
        <div className="space-y-2.5 bg-canvas-glacial p-4 border border-border-subtle rounded-xl text-xs text-ink-muted">
          <div className="flex items-start gap-2">
            <ShieldCheck size={16} className="text-life-600 shrink-0 mt-0.5" />
            <span>
              <strong className="text-ink-primary">Historial protegido:</strong> Consulta tus evaluaciones pasadas desde cualquier dispositivo.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck size={16} className="text-life-600 shrink-0 mt-0.5" />
            <span>
              <strong className="text-ink-primary">Reporte PDF oficial:</strong> Emite tu dictamen técnico con folio único y firma digital.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck size={16} className="text-life-600 shrink-0 mt-0.5" />
            <span>
              <strong className="text-ink-primary">100% Confidencial:</strong> No comercializamos ni compartimos tus datos con terceros.
            </span>
          </div>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="p-3 bg-emergency-50 border border-emergency-200 text-emergency-600 rounded-xl text-xs flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Botón de Google OAuth */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full min-h-[48px] px-4 py-3 bg-canvas-surface hover:bg-canvas-glacial text-ink-primary border border-border-subtle font-bold text-sm flex items-center justify-center gap-3 rounded-xl transition-all shadow-xs focus:outline-hidden focus:ring-2 focus:ring-sky-500 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin text-sky-600" />
                <span>Conectando con Google...</span>
              </>
            ) : (
              <>
                {/* SVG Oficial de Google */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continuar con Google</span>
              </>
            )}
          </button>

          <Button
            onClick={closeAuthModal}
            variant="outline"
            size="md"
            fullWidth
            disabled={loading}
          >
            <span>Cancelar</span>
          </Button>
        </div>

        {/* Pie de modal */}
        <p className="text-[11px] text-ink-muted text-center border-t border-border-subtle pt-3">
          Al continuar, aceptas la política de uso cívico y ético de Senda.
        </p>
      </div>
    </div>
  );
};
