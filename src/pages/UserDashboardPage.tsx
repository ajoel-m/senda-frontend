import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  MapPin,
  Calendar,
  Trash2,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  LogIn,
  CheckCircle2,
} from 'lucide-react';
import { RiskBadge, RiskLevel } from '../components/RiskBadge';
import {
  getLocalEvaluations,
  deleteLocalEvaluation,
  StoredEvaluation,
  supabase,
} from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { MountainBackdrop } from '../components/brand/MountainBackdrop';

export const UserDashboardPage: React.FC = () => {
  const [evaluations, setEvaluations] = useState<StoredEvaluation[]>([]);
  const { user, isAuthenticated, openAuthModal } = useAuth();

  useEffect(() => {
    // Si el usuario está autenticado, consultar estrictamente las evaluaciones vinculadas a su cuenta
    const fetchUserEvaluations = async () => {
      if (user?.id) {
        // Migración automática de reportes anónimos previos a la cuenta activa
        try {
          const rawLocal = getLocalEvaluations();
          const hasAnon = rawLocal.some((l) => !l.user_id);
          if (hasAnon) {
            const updated = rawLocal.map((l) => (!l.user_id ? { ...l, user_id: user.id } : l));
            localStorage.setItem('mi_casa_segura_evaluaciones', JSON.stringify(updated));
          }
        } catch {
          // Ignorar modo privado
        }

        try {
          const { data, error } = await supabase
            .from('evaluaciones_viviendas')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (!error && data) {
            const remoteEvals: StoredEvaluation[] = data.map((item) => ({
              id: item.id,
              user_id: item.user_id,
              created_at: item.created_at,
              lat: Number(item.lat),
              lon: Number(item.lon),
              cityId: item.departamento === 'Lima' ? 'lima' : 'huaraz',
              material: item.material_predominante || 'ladrillo',
              numero_pisos: item.numero_pisos || 1,
              vulnerabilidad_calculada: item.vulnerabilidad_calculada || 'medium',
              riesgo_total_calculado: item.riesgo_total_calculado || 'medium',
              detalle_evaluacion: item.detalle_evaluacion || {},
            }));

            // En local solo considerar aquellas que coincidan explícitamente con este user_id
            const local = getLocalEvaluations().filter((l) => l.user_id === user.id);
            const ids = new Set(remoteEvals.map((e) => e.id));
            const combined = [...remoteEvals, ...local.filter((l) => !ids.has(l.id))];
            setEvaluations(combined);
            return;
          }
        } catch {
          // Fallback en caso de desconexión: solo las guardadas con el user_id activo
          setEvaluations(getLocalEvaluations().filter((l) => l.user_id === user.id));
          return;
        }
      } else {
        // Modo invitado no autenticado: solo reportes locales sin usuario asignado
        setEvaluations(getLocalEvaluations().filter((l) => !l.user_id));
      }
    };

    fetchUserEvaluations();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar este reporte de forma permanente?')) {
      deleteLocalEvaluation(id);
      if (user?.id) {
        try {
          await supabase
            .from('evaluaciones_viviendas')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);
        } catch {
          // Respaldo silencioso si no hay conexión de red
        }
      }
      setEvaluations((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const mapLevelToRiskBadge = (level: string): RiskLevel => {
    const l = (level || '').toLowerCase();
    if (l.includes('crit') || l.includes('muy alto')) return 'critical';
    if (l.includes('high') || l.includes('alto')) return 'high';
    if (l.includes('med') || l.includes('medio')) return 'medium';
    return 'low';
  };

  return (
    <div className="w-full bg-transparent text-ink-primary py-10 px-4 sm:px-6 min-h-screen relative">
      <MountainBackdrop />
      <main className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Cabecera del Panel */}
        <div className="border-b border-border-subtle pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-border-subtle text-xs font-bold tracking-wider text-sky-700 uppercase rounded-full">
              <User size={14} />
              <span>Panel Ciudadano</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-ink-primary tracking-tight">
              Mis Reportes Guardados
            </h1>
            <p className="text-sm text-ink-muted">
              Historial de evaluaciones estructurales y diagnósticos de vulnerabilidad de tu vivienda.
            </p>
          </div>

          <Link to="/evaluar">
            <button
              type="button"
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Nueva Evaluación</span>
              <ArrowRight size={16} />
            </button>
          </Link>
        </div>

        {/* Banner de Sincronización Google OAuth */}
        {isAuthenticated ? (
          <div className="p-5 border border-life-500/30 bg-life-50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm text-life-600 shadow-xs">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={22} className="text-life-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-life-600 text-sm">
                  Sincronización en la Nube Activa
                </span>
                <span className="text-ink-muted">
                  Conectado como <strong className="text-ink-primary">{user?.email}</strong>. Tus evaluaciones se resguardan de forma privada en tu cuenta personal.
                </span>
              </div>
            </div>
            <span className="shrink-0 font-mono text-[11px] bg-canvas-surface border border-life-500/30 px-3 py-1 text-life-600 font-bold rounded-lg shadow-2xs">
              Google OAuth Activo
            </span>
          </div>
        ) : (
          <div className="p-5 border border-border-subtle bg-canvas-surface rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm text-ink-primary shadow-xs">
            <div className="flex items-start gap-3">
              <LogIn size={22} className="text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sm text-ink-primary">
                  Inicia sesión para sincronizar tus reportes
                </span>
                <span className="text-ink-muted">
                  Conéctate con tu cuenta de Google para respaldar tus dictámenes en la nube y acceder a ellos desde cualquier dispositivo.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal('/mis-reportes')}
              className="shrink-0 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Ingresar con Google</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Listado de Evaluaciones Guardadas */}
        {evaluations.length === 0 ? (
          <div className="p-12 border border-border-subtle text-center space-y-4 bg-canvas-surface rounded-2xl shadow-xs">
            <div className="w-14 h-14 mx-auto bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600">
              <ShieldCheck size={28} />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="font-bold text-base text-ink-primary">
                Aún no tienes evaluaciones guardadas
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Realiza tu primer diagnóstico cívico para conocer si tu vivienda presenta vulnerabilidad ante sismos o aluviones.
              </p>
            </div>
            <div className="pt-2">
              <Link to="/evaluar">
                <button
                  type="button"
                  className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Evaluar mi Casa</span>
                  <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {evaluations.map((item, index) => {
              const dateStr = item.created_at
                ? new Date(item.created_at).toLocaleDateString('es-PE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Fecha no registrada';

              const triggers = item.detalle_evaluacion?.hardTriggers || [];

              return (
                <div
                  key={item.id || index}
                  className="p-5 sm:p-6 border border-border-subtle bg-canvas-surface rounded-2xl space-y-4 transition-all hover:border-sky-400 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                        <Calendar size={14} className="text-sky-600" />
                        <span>{dateStr}</span>
                      </div>
                      <span className="text-xs font-mono text-ink-muted bg-canvas-glacial px-2.5 py-0.5 rounded-lg border border-border-subtle">
                        ID: {item.id ? item.id.slice(0, 8) : `00${index + 1}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-ink-muted font-medium">Riesgo Total:</span>
                        <RiskBadge level={mapLevelToRiskBadge(item.riesgo_total_calculado)} />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-ink-muted hover:text-emergency-600 hover:bg-emergency-50 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar este reporte"
                        aria-label="Eliminar este reporte"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 bg-canvas-glacial border border-border-subtle rounded-xl">
                      <span className="font-semibold text-ink-muted block mb-1">Ubicación Registrada</span>
                      <div className="flex items-center gap-1.5 font-bold text-ink-primary">
                        <MapPin size={14} className="text-sky-600" />
                        <span>{item.cityId === 'lima' ? 'Lima Metropolitana' : 'Huaraz (Áncash)'}</span>
                      </div>
                      <span className="text-[11px] text-ink-muted font-mono mt-0.5 block">
                        {item.lat?.toFixed(4)}, {item.lon?.toFixed(4)}
                      </span>
                    </div>

                    <div className="p-3 bg-canvas-glacial border border-border-subtle rounded-xl">
                      <span className="font-semibold text-ink-muted block mb-1">Estructura Declarada</span>
                      <span className="font-bold text-ink-primary capitalize block">
                        {item.material || 'Ladrillo'} · {item.numero_pisos || 1} piso(s)
                      </span>
                      <span className="text-[11px] text-ink-muted mt-0.5 block">
                        Vulnerabilidad: <strong className="text-ink-primary">{item.vulnerabilidad_calculada}</strong>
                      </span>
                    </div>

                    <div className="p-3 bg-canvas-glacial border border-border-subtle rounded-xl flex flex-col justify-between">
                      <span className="font-semibold text-ink-muted block mb-1">Observaciones Técnicas</span>
                      {triggers.length > 0 ? (
                        <div className="flex items-center gap-1.5 text-emergency-600 font-bold">
                          <AlertTriangle size={15} />
                          <span>Infracción crítica a RNE detectada</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-life-600 font-semibold">
                          <CheckCircle2 size={15} />
                          <span>Sin infracciones críticas de colapso</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Zona de Privacidad y Eliminación de Cuenta */}
        <div className="pt-8 border-t border-border-subtle space-y-3">
          <h3 className="text-xs font-bold text-ink-muted uppercase tracking-wider">
            Gestión de Privacidad y Datos
          </h3>
          <p className="text-xs text-ink-muted leading-relaxed max-w-xl">
            Puedes eliminar inmediatamente todo tu historial de diagnósticos y desvincular tus registros de este dispositivo.
          </p>

          <button
            type="button"
            onClick={async () => {
              if (
                window.confirm(
                  '¿Estás seguro de que deseas eliminar tu historial y todas tus evaluaciones guardadas? Esta acción es permanente e irreversible.'
                )
              ) {
                localStorage.removeItem('mi_casa_segura_evaluaciones');
                setEvaluations([]);

                if (user?.id) {
                  try {
                    await supabase
                      .from('evaluaciones_viviendas')
                      .delete()
                      .eq('user_id', user.id);
                  } catch (e) {
                    console.warn('Error eliminando registros remotos:', e);
                  }
                }

                alert('Tus datos han sido eliminados de este dispositivo.');
                window.location.href = '/';
              }
            }}
            className="px-4 py-2.5 bg-emergency-50 hover:bg-emergency-100 text-emergency-600 border border-emergency-200 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Trash2 size={15} />
            <span>Eliminar mis evaluaciones y datos guardados</span>
          </button>
        </div>
      </main>
    </div>
  );
};
