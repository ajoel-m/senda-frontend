import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertTriangle, ShieldCheck, ArrowRight, Compass } from 'lucide-react';
import { SendaHeroBanner } from '../components/brand/SendaHeroBanner';

import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();

  const triggerPanic = () => {
    navigate('/panico');
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-130px)] bg-transparent text-ink-primary py-4 px-4 sm:px-6 overflow-hidden">
      {/* Paisaje real, acotado a una franja de altura compacta en la parte
          superior para permitir que los botones de acción queden visibles
          inmediatamente sin obligar al usuario a hacer scroll. */}
      <div
        className="absolute top-0 inset-x-0 h-[210px] sm:h-[230px] z-0 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: "url('/assets/hero-landscape.jpg')" }}
        aria-hidden="true"
      />
      {/* Velo de legibilidad: transición suave de la foto al fondo dinámico */}
      <div
        className="absolute top-0 inset-x-0 h-[210px] sm:h-[230px] z-[1] pointer-events-none dark:hidden"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(247,249,252,0.15) 30%, rgba(247,249,252,0.65) 70%, rgba(247,249,252,0) 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 inset-x-0 h-[210px] sm:h-[230px] z-[1] pointer-events-none hidden dark:block"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(11,19,34,0.3) 30%, rgba(11,19,34,0.85) 70%, rgba(11,19,34,0) 100%)',
        }}
        aria-hidden="true"
      />

      <main className="relative z-10 max-w-md md:max-w-xl lg:max-w-2xl mx-auto space-y-4 sm:space-y-5">
        {/* Panel principal ilustrado compacto: Alertin + logo Senda */}
        <SendaHeroBanner />

        {/* Cabecera Principal / Home Operativo */}
        <div id="home-contenido" className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-life-50 border border-life-600 rounded-full text-[11px] font-semibold uppercase tracking-wider text-life-600">
            <Compass size={13} className="text-life-600" />
            <span>Cobertura: Huaraz y Lima Metropolitana</span>
          </div>
          <p className="text-xs sm:text-sm font-extrabold text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.85)] tracking-wide">
            Gestión cívica del riesgo ante sismos y aluviones en el Perú.
          </p>
        </div>

        {/* Respaldo Institucional Integrado */}
        <div className="text-center space-y-1 pt-0.5">
          <p className="text-[11px] font-medium text-ink-muted flex items-center justify-center gap-1.5">
            <ShieldCheck size={13} className="text-sky-600" />
            <span>Respaldado por cartografía y normativa oficial:</span>
          </p>
          <div className="flex items-center justify-center gap-2.5 text-[11px] font-bold text-ink-muted tracking-wide">
            <span className="hover:text-sky-700 transition-colors">INAIGEM</span>
            <span className="text-sky-400">·</span>
            <span className="hover:text-sky-700 transition-colors">IGP</span>
            <span className="text-sky-400">·</span>
            <span className="hover:text-sky-700 transition-colors">INDECI</span>
            <span className="text-sky-400">·</span>
            <span className="hover:text-sky-700 transition-colors">CENEPRED</span>
          </div>
        </div>

        {/* DECISIÓN PRINCIPAL: 2 BOTONES PRINCIPALES VISIBLES EN PANTALLA */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Tarjeta 1: PÁNICO (Aluvión Huaraz) - Clic Directo e Inmediato con Aura de Brillo */}
          <button
            type="button"
            onClick={triggerPanic}
            className="min-h-[170px] sm:min-h-[190px] rounded-2xl bg-emergency-600 hover:bg-emergency-700 border-2 border-emergency-500 text-white p-4 flex flex-col items-center justify-between text-center cursor-pointer active:scale-98 transition-all animate-panic-glow"
            aria-label="Botón de pánico: calcular ruta de evacuación inmediata"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mt-1">
              <AlertTriangle size={28} className="text-white" />
            </div>

            <div className="space-y-0.5">
              <span className="text-base sm:text-lg font-black tracking-wider uppercase block">
                PÁNICO
              </span>
              <span className="text-xs font-semibold text-white/90 block">
                (Aluvión Huaraz)
              </span>
              <span className="text-[11px] font-bold text-emergency-100 uppercase tracking-wider block pt-0.5">
                Clic para evacuar
              </span>
            </div>

            <span className="text-[10px] text-white/80">
              Ruta rápida a zona segura
            </span>
          </button>

          {/* Tarjeta 2: PREVENCIÓN Y EVALUACIÓN */}
          <button
            type="button"
            onClick={() => navigate('/prevencion')}
            className="min-h-[170px] sm:min-h-[190px] rounded-2xl bg-sky-600 hover:bg-sky-700 border-2 border-sky-700 text-white p-4 flex flex-col items-center justify-between text-center shadow-md cursor-pointer active:scale-98 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mt-1">
              <ShieldCheck size={28} className="text-white" />
            </div>

            <div className="space-y-0.5">
              <span className="text-base sm:text-lg font-black tracking-wider uppercase block">
                PREVENCIÓN
              </span>
              <span className="text-xs font-semibold text-white/90 block">
                Y EVALUACIÓN
              </span>
              <span className="text-[11px] text-sky-100 block pt-0.5">
                Recomendaciones y Test
              </span>
            </div>

            <span className="text-[10px] text-white/80">
              Conoce el riesgo de tu casa
            </span>
          </button>
        </div>



        {/* Enlace Cívico a Landing Informativo */}
        <div className="pt-2 text-center">
          <Link
            to="/informacion"
            className="animate-subtle-shine inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-sky-700 hover:text-sky-800 hover:underline transition-all"
          >
            <span>Conoce más sobre este proyecto cívico</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Descargo de Responsabilidad Sutil */}
        <p className="text-[11px] text-ink-muted/80 text-center leading-relaxed max-w-sm mx-auto pt-2">
          Herramienta cívica informativa basada en datos oficiales (INAIGEM, CENEPRED, RNE). No reemplaza la inspección técnica de un profesional colegiado.
        </p>

        {/* Invitación a Registrarse — justo encima de "Empresas": registrarte
            es, hoy, la única forma de mostrarnos que hay interés real en
            Senda (no hay otra encuesta ni lista de espera separada).
            Siempre visible (con Alertin Cuida en los dos casos): si no hay
            sesión, invita a registrarse; si ya la hay, agradece — así la
            tarjeta no "desaparece" para quien prueba ya con sesión activa
            (como en desarrollo local, donde el bypass deja la sesión
            siempre iniciada). */}
        <div className="rounded-2xl border border-border-subtle bg-canvas-surface p-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <img
            src="/mascots/alertin_cuida.svg"
            alt="Alertin cuidándote"
            className="w-16 h-16 shrink-0"
          />
          {isAuthenticated ? (
            <div className="flex-1">
              <p className="text-sm font-bold text-ink-primary">
                ¡Gracias por registrarte!
              </p>
              <p className="text-xs text-ink-muted mt-0.5">
                Ya nos ayudas a mostrar que hay interés real en Senda. Es un prototipo en pruebas — tu evaluación queda guardada y tu opinión nos sirve para mejorar.
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1">
                <p className="text-sm font-bold text-ink-primary">
                  ¿Nos ayudas a probar Senda?
                </p>
                <p className="text-xs text-ink-muted mt-0.5">
                  Es un prototipo en pruebas. Registrarte es, hoy, la forma más directa de mostrarnos que te interesa — y nos ayuda a guardar tu evaluación y a darnos tu opinión.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openAuthModal('/')}
                className="shrink-0 px-5 py-2.5 min-h-[44px] bg-senda-nevado hover:bg-[#092A4A] text-white font-bold text-sm rounded-xl transition-colors"
              >
                Regístrate
              </button>
            </>
          )}
        </div>

        {/* Anuncio: Próximo apartado para empresas (piloto B2B en exploración) */}
        <Link
          to="/empresas"
          className="block rounded-2xl border border-border-subtle bg-canvas-surface p-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left hover:border-sky-600/40 transition-colors"
        >
          <img
            src="/mascots/alertin_previene.svg"
            alt="Alertin previniendo"
            className="w-16 h-16 shrink-0"
          />
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-sky-700">
              Próximamente
            </p>
            <p className="text-sm font-bold text-ink-primary mt-0.5">
              Senda para Empresas
            </p>
            <p className="text-xs text-ink-muted mt-0.5">
              Estamos explorando un mapa de riesgo para empresas con operaciones en zonas vulnerables, que cruce peligros oficiales con recomendaciones del Estado — para que la empresa y la autoridad planifiquen obras preventivas con la misma información.
            </p>
          </div>
          <ArrowRight size={18} className="text-sky-700 shrink-0 hidden sm:block" />
        </Link>
      </main>
    </div>
  );
};
