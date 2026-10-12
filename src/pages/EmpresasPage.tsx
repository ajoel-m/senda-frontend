import React from 'react';
import { Link } from 'react-router-dom';
import {
  Factory,
  MapPin,
  Landmark,
  Handshake,
  FileWarning,
  ArrowRight,
} from 'lucide-react';
import { MascotGuide } from '../components/MascotGuide';
import { MountainBackdrop } from '../components/brand/MountainBackdrop';

export const EmpresasPage: React.FC = () => {
  return (
    <div className="relative w-full min-h-[calc(100vh-130px)] bg-transparent text-ink-primary py-10 px-4 sm:px-6">
      <MountainBackdrop />
      <main className="relative z-10 max-w-3xl mx-auto space-y-8">
        {/* Cabecera */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-xs font-semibold tracking-wider text-sky-700 uppercase rounded-md">
            <Factory size={14} />
            <span>Piloto B2B en exploración</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-ink-primary tracking-tight">
            Senda para Empresas
          </h1>
          <p className="text-base text-ink-muted leading-relaxed">
            Un mapa de riesgo de la zona de operación para empresas extractivas y de infraestructura, que cruza los peligros oficiales del territorio con las recomendaciones del Estado — para que la empresa planifique sus obras preventivas, y para que la autoridad también gestione las suyas.
          </p>
        </div>

        <MascotGuide
          compact
          mood="explaining"
          title="De dónde viene esta iniciativa"
          text="A partir de diálogos y análisis con operaciones como Antamina en Áncash, identificamos un cuello de botella crítico: empresas con activos e infraestructura logística expuesta a cuencas torrenciales y laderas inestables que hoy carecen de un visor unificado que cruce el riesgo del territorio con la cartografía oficial del Estado."
        />

        {/* El caso de uso en terreno */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-bold text-ink-primary">
            <MapPin className="text-senda-nevado dark:text-senda-cielo" size={22} />
            <h2>Corredores operacionales de alta exposición</h2>
          </div>
          <div className="p-5 rounded-2xl border border-border-subtle bg-canvas-surface space-y-3">
            <p className="text-sm text-ink-muted leading-relaxed">
              En regiones como Áncash, la continuidad operativa no se define únicamente dentro del tajo o la planta concentradora, sino a lo largo de sus <strong>corredores estratégicos</strong>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-canvas-glacial border border-border-subtle">
                <span className="text-xs font-bold text-ink-primary block mb-1">Corredor Conococha - Pativilca</span>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Vía crítica de transporte terrestre expuesta a deslizamientos por lluvias intensas, fallas de talud y sismicidad regional.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-canvas-glacial border border-border-subtle">
                <span className="text-xs font-bold text-ink-primary block mb-1">Corredor Huarmey (Puerto Punta Lobitos)</span>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Terminal de embarque y trayectoria del mineroducto, atravesando cauces secos susceptibles a huaicos extraordinarios por Fenómeno El Niño.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* El problema actual */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-bold text-ink-primary">
            <FileWarning className="text-emergency-600" size={22} />
            <h2>El cuello de botella en obras de prevención</h2>
          </div>
          <div className="p-5 rounded-2xl border border-border-subtle bg-canvas-surface space-y-3">
            <p className="text-sm text-ink-muted leading-relaxed">
              Cuando una empresa busca ejecutar obras de mitigación y defensa ribereña <strong>fuera de su concesión</strong> (para proteger comunidades o asegurar vías públicas de acceso), no puede intervenir directamente: depende de autorizaciones del Estado, la Autoridad Nacional del Agua (ANA), la Administración Local del Agua (ALA), Provías Nacional y gobiernos subnacionales.
            </p>
            <p className="text-sm text-ink-muted leading-relaxed">
              El proceso de aprobación técnica se prolonga durante meses —o años— porque la empresa y el Estado levantan información territorial de forma aislada, duplicando estudios de campo y discrepando en la línea base de peligro.
            </p>
          </div>
        </section>

        {/* Qué ofrecemos */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-bold text-ink-primary">
            <Factory className="text-sky-700" size={22} />
            <h2>Solución Senda: Base común de información técnica</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-border-subtle bg-canvas-surface space-y-2">
              <h3 className="font-bold text-sm text-ink-primary">Centralización de reportes oficiales</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Integramos en una sola capa los estudios de modelamiento aluvial del INAIGEM, mapas de inundación de la ANA/ALA, zonificación sísmica del CIGM/CISMID y reportes de emergencias del COER Áncash.
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-border-subtle bg-canvas-surface space-y-2">
              <h3 className="font-bold text-sm text-ink-primary">Aceleración de expedientes técnicos</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Al compartir la misma fuente técnica oficial (SSOT), la empresa y la entidad pública reducen los tiempos de observación técnica para obras por impuestos y convenios de inversión social.
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-border-subtle bg-canvas-surface space-y-2">
              <h3 className="font-bold text-sm text-ink-primary">Visor territorial multiamenaza</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Monitoreo de quebradas activas, estabilidad de taludes y cauces que cruzan infraestructuras lineales críticas (ductos, líneas de transmisión, rutas logísticas).
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-border-subtle bg-canvas-surface space-y-2">
              <h3 className="font-bold text-sm text-ink-primary">Impacto social medible</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Capacidad de transferir diagnósticos preventivos a las familias de las comunidades del área de influencia directa, fortaleciendo la licencia social con prevención real.
              </p>
            </div>
          </div>
        </section>

        {/* Alianzas estratégicas */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-bold text-ink-primary">
            <Handshake className="text-life-600" size={22} />
            <h2>Alianzas para cerrar la brecha de ejecución</h2>
          </div>
          <div className="p-5 rounded-2xl border border-border-subtle bg-canvas-surface space-y-3">
            <p className="text-sm text-ink-muted leading-relaxed">
              El diagnóstico es solo el primer paso. Para que la prevención salve vidas e infraestructura, Senda articula una red de aliados estratégicos en el territorio:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-canvas-glacial border border-border-subtle">
                <span className="text-xs font-bold text-ink-primary block mb-1">Cadenas Ferreteras</span>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Abastecimiento de insumos normados (cemento tipo I/V, mallas electrosoldadas, acero sismo-resistente y mochilas equipadas).
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-canvas-glacial border border-border-subtle">
                <span className="text-xs font-bold text-ink-primary block mb-1">Constructoras Locales</span>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Mano de obra capacitada para reforzamiento estructural de viviendas y obras comunitarias de contención.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-canvas-glacial border border-border-subtle">
                <span className="text-xs font-bold text-ink-primary block mb-1">Ingenieros Colegiados (CIP)</span>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Peritaje y validación técnica formal de expedientes y dictámenes de habitabilidad post-desastre.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Beneficio para el Estado */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-bold text-ink-primary">
            <Landmark className="text-ink-primary" size={22} />
            <h2>Sinergia público-privada para la gestión del riesgo</h2>
          </div>
          <p className="text-sm text-ink-muted leading-relaxed">
            La misma cartografía que optimiza la inversión preventiva privada sirve a las municipalidades y al Centro de Operaciones de Emergencia (COER/COEN) para priorizar obras públicas de defensas ribereñas y planes de contingencia comunitarios sin duplicar presupuestos.
          </p>
        </section>

        <div className="p-5 rounded-2xl bg-canvas-surface border border-border-subtle flex flex-col sm:flex-row items-center gap-4">
          <p className="text-sm text-ink-muted flex-1 text-center sm:text-left">
            Esto todavía es una idea en exploración, no un producto terminado. Si tu empresa o entidad tiene interés, regístrate en Senda para que sepamos que hay interés real.
          </p>
          <Link
            to="/"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] bg-senda-nevado hover:bg-[#092A4A] text-white font-bold text-sm rounded-xl transition-colors"
          >
            <span>Ir a Inicio</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
};
