import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  HardHat,
  Handshake,
  Database,
  BarChart,
  Heart,
  Sparkles,
  Check,
} from 'lucide-react';
import { MascotGuide } from '../components/MascotGuide';

export const NextStepsPage: React.FC = () => {
  return (
    <div className="w-full bg-transparent text-ink-primary py-10 px-4 sm:px-6">
      <main className="max-w-4xl mx-auto space-y-12">
        {/* Cabecera */}
        <div className="border-b border-border-subtle pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-xs font-semibold tracking-wider text-sky-700 uppercase rounded-md">
            <TrendingUp size={14} />
            <span>Hoja de Ruta Estratégica</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-ink-primary">
            Próximos Pasos: Sostenibilidad Ética y Compromiso Cívico
          </h1>
          <p className="text-base text-ink-muted leading-relaxed">
            Para que <em>Senda</em> sea un proyecto sostenible en el tiempo sin comprometer su vocación cívica ni cobrarle al ciudadano por evaluar su vivienda, estructuramos un modelo responsable basado en 5 vectores de sostenibilidad y un fondo de impacto social directo.
          </p>
        </div>

        {/* ------------------------------------------------------------------
            1. LOS 5 VECTORES DE RENTABILIDAD Y SOSTENIBILIDAD
            ------------------------------------------------------------------ */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-ink-primary">
              1. Cinco Vectores de Sostenibilidad y Modelo Cívico
            </h2>
            <p className="text-sm text-ink-muted">
              Valor agregado que subsidia la gratuidad total para las familias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vector 1 */}
            <div className="p-5 border border-border-subtle bg-canvas-surface rounded-2xl space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-sm text-sky-700">
                <ShoppingBag size={18} />
                <span>Vector 1: Mochilas de Emergencia Certificadas</span>
              </div>
              <h3 className="font-bold text-base text-ink-primary">
                Kits de supervivencia auditados bajo norma INDECI
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Adquisición directa de la mochila oficial de 7,044 g y kits complementarios (abrigo andino, botiquín clínico o reserva de 72h) auditados según estándares oficiales.
              </p>
            </div>

            {/* Vector 2 */}
            <div className="p-5 border border-border-subtle bg-canvas-surface rounded-2xl space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-sm text-sky-700">
                <HardHat size={18} />
                <span>Vector 2: Red de Ingeniería Civil</span>
              </div>
              <h3 className="font-bold text-base text-ink-primary">
                Conexión con peritos colegiados (CIP) e ingenieros locales
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Vinculación directa entre familias con viviendas en riesgo y profesionales colegiados habilitados para levantamiento de planos estructurales y memorias de reforzamiento.
              </p>
            </div>

            {/* Vector 3 */}
            <div className="p-5 border border-border-subtle bg-canvas-surface rounded-2xl space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-sm text-sky-700">
                <Handshake size={18} />
                <span>Vector 3: Alianzas Institucionales</span>
              </div>
              <h3 className="font-bold text-base text-ink-primary">
                Espacios de difusión con entidades del sector construcción
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Alianzas de divulgación preventiva con fabricantes de acero corrugado normado, cementeras y programas de protección habitacional.
              </p>
            </div>

            {/* Vector 4 */}
            <div className="p-5 border border-border-subtle bg-canvas-surface rounded-2xl space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-sm text-sky-700">
                <Database size={18} />
                <span>Vector 4: Consultas de Riesgo para Entidades</span>
              </div>
              <h3 className="font-bold text-base text-ink-primary">
                Evaluación geoespacial para cooperativas y cajas de ahorro
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Herramienta de consulta para entidades que evalúan microcréditos de mejoramiento de vivienda en zonas periféricas de Huaraz y Lima.
              </p>
            </div>

            {/* Vector 5 */}
            <div className="md:col-span-2 p-5 border border-border-subtle bg-canvas-surface rounded-2xl space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-sm text-sky-700">
                <BarChart size={18} />
                <span>Vector 5: Inteligencia Territorial Agregada</span>
              </div>
              <h3 className="font-bold text-base text-ink-primary">
                Tableros e informes macro para municipalidades y planificación urbana
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Reportes consolidados y anonimizados de vulnerabilidad barrial para gobiernos locales, permitiendo orientar obras públicas de defensa ribereña y muros de contención.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            2. COMPROMISO SOCIAL Y FONDO PREVENTIVO
            ------------------------------------------------------------------ */}
        <section className="space-y-6 border-t border-border-subtle pt-8">
          <div className="flex items-center gap-2 text-lg font-bold text-ink-primary">
            <Heart className="text-emergency-600" size={22} />
            <h2>2. Responsabilidad Social: Fondo de Impacto Preventivo</h2>
          </div>

          <div className="p-6 border border-border-subtle bg-canvas-surface rounded-2xl space-y-4 shadow-xs">
            <p className="text-sm text-ink-primary leading-relaxed">
              La misión de <em>Senda</em> no es alarmar, sino salvar vidas mediante el conocimiento anticipado. Por ello, establecemos dos compromisos sociales irrenunciables:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-canvas-glacial border border-border-subtle rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emergency-600 uppercase tracking-wider">
                  <Check size={16} />
                  <span>Donación Comunitaria</span>
                </div>
                <h4 className="font-bold text-sm text-ink-primary">
                  Mochilas en zonas críticas
                </h4>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Por cada 10 mochilas comercializadas a través de la plataforma, canalizamos 1 mochila equipada a familias en fajas marginales de muy alto riesgo.
                </p>
              </div>

              <div className="p-4 bg-canvas-glacial border border-border-subtle rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-700 uppercase tracking-wider">
                  <Check size={16} />
                  <span>Fondo Educativo</span>
                </div>
                <h4 className="font-bold text-sm text-ink-primary">
                  Talleres de autoconstrucción segura
                </h4>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Destinamos fondos a brigadas presenciales con maestros de obra y estudiantes de ingeniería para capacitar a vecinos en confinamiento correcto de muros.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            3. AVANCE DE LA MASCOTA INSTITUCIONAL
            ------------------------------------------------------------------ */}
        <section className="space-y-6 border-t border-border-subtle pt-8">
          <div className="flex items-center gap-2 text-lg font-bold text-ink-primary">
            <Sparkles className="text-dawn-amber" size={22} />
            <h2>3. Incorporación: Alertin, la mascota de Senda</h2>
          </div>

          <p className="text-sm text-ink-muted leading-relaxed">
            <strong>Alertin</strong> acompaña a las familias en cada paso del autodiagnóstico con orientaciones claras y amables.
          </p>

          <div className="space-y-4">
            <MascotGuide
              mood="explaining"
              title="Alertin te orienta en el mapa"
              text="Ubica tu casa en el visor satelital para saber si estás dentro de las fajas de aluvión del INAIGEM o en suelos blandos con amplificación sísmica."
            />
            <MascotGuide
              mood="warning"
              title="Atención con los materiales"
              text="Recuerda que el ladrillo pandereta está diseñado exclusivamente para tabiques divisorios, nunca para soportar el peso de 2 o más pisos."
            />
            <MascotGuide
              mood="success"
              title="Construcción formal y segura"
              text="¡Excelente! Las viviendas de concreto armado con columnas y vigas de amarre continuas ofrecen la mejor respuesta ante sismos severos."
            />
          </div>
        </section>
      </main>
    </div>
  );
};
